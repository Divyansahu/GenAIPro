const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")
const puppeteer = require("puppeteer")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});

const interviewReportSchema = z.object({
    maxScore: z.number().describe("A score between 0 and 100 indicating how well the candidate matches the job description"),

    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take")
    })).describe("Technical questions that can be asked in the interview along with their intention and answers"),

    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and answers"),

    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum(["low", "medium", "high"]).describe("The severity of the skill gap")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),

    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan"),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day")
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview"),
    title: z.string().describe("The title of the job for which the interview report is generated"),
});


async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

    const prompt = `Generate an interview report for a candidate with the following details:
        Resume: ${resume}
        Self Description: ${selfDescription}
        Job Description: ${jobDescription}
        Return ONLY valid JSON matching the provided schema.
        Do not include markdown, explanations or extra text.
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(interviewReportSchema)
        }
    })

    return JSON.parse(response.text)
}

async function generateResumePdf({ resume, jobDescription, selfDescription }) {
    const prompt = `You are a professional resume writer and career consultant.
Generate a clean, modern, and highly professional HTML resume tailored for the following target job:
Target Job Description:
${jobDescription}

Candidate's Original Resume Content:
${resume}

Candidate's Self Description / Preferences:
${selfDescription}

Requirements for the HTML page:
1. It MUST be a single, complete, valid HTML document (including <html>, <head>, <body>, and a <style> block).
2. The design must be premium and modern. Use professional typography (like Arial, Helvetica, or sans-serif), clean layouts, subtle separators, and a cohesive color palette (e.g., dark slate header, teal or dark blue headings, slate-gray body text).
3. The layout must fit standard A4 margins when printed. Ensure good spacing (padding/margins) so it looks clean and readable.
4. Structure the resume logically: Professional Header (Name, Contact Info, links), Professional Summary/Profile (aligned with the target job), Key Technical Skills (matching the job description), Projects (highlighting relevant ones), and Work Experience.
5. Highlight how the candidate's skills match the target job, emphasizing Node.js, Express, REST APIs, query optimization, etc.
6. Return ONLY the clean, raw HTML code. Do not wrap the response in markdown code blocks (like \`\`\`html or \`\`\`), do not include explanations, and do not write any text outside of the HTML document.
`;

    // 1. Generate HTML using Gemini API
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
    });

    let html = response.text.trim();
    
    // Clean up markdown code fences if Gemini returned them despite instructions
    if (html.startsWith("```html")) {
        html = html.substring(7);
    } else if (html.startsWith("```")) {
        html = html.substring(3);
    }
    if (html.endsWith("```")) {
        html = html.substring(0, html.length - 3);
    }
    html = html.trim();

    // 2. Render HTML to PDF using Puppeteer
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });
        
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '15mm',
                right: '15mm',
                bottom: '15mm',
                left: '15mm'
            }
        });
        
        return pdfBuffer;
    } finally {
        await browser.close();
    }
}

module.exports = {
    generateInterviewReport,
    generateResumePdf
}