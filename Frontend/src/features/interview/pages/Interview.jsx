import React, { useState, useEffect } from "react";
import "../style/interview.scss";
import { useInterview } from "../hooks/useInterview";
import { useParams } from "react-router";
import { useAuth } from "../../auth/hooks/useAuth";

const NAV_ITEMS = [
    {
        id: "technical",
        label: "Technical Questions",
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
            </svg>
        )
    },
    {
        id: "behavioral",
        label: "Behavioral Questions",
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
        )
    },
    {
        id: "roadmap",
        label: "Road Map",
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <polygon points="3 11 22 2 13 21 11 13 3 11" />
            </svg>
        )
    }
];

const QuestionCard = ({ item, index }) => {

    const [open, setOpen] = useState(false);

    return (

        <div className="q-card">

            <div
                className="q-card__header"
                onClick={() => setOpen(!open)}
            >

                <span className="q-card__index">
                    Q{index + 1}
                </span>

                <p className="q-card__question">
                    {item.question}
                </p>

                <span
                    className={`q-card__chevron ${
                        open ? "q-card__chevron--open" : ""
                    }`}
                >

                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polyline points="6 9 12 15 18 9" />
                    </svg>

                </span>

            </div>

            {open && (

                <div className="q-card__body">

                    <div className="q-card__section">

                        <span className="q-card__tag q-card__tag--intention">
                            Intention
                        </span>

                        <p>{item.intention}</p>

                    </div>

                    <div className="q-card__section">

                        <span className="q-card__tag q-card__tag--answer">
                            Model Answer
                        </span>

                        <p>{item.answer}</p>

                    </div>

                </div>

            )}

        </div>

    );
};

const RoadMapDay = ({ day }) => (

    <div className="roadmap-day">

        <div className="roadmap-day__header">

            <span className="roadmap-day__badge">
                Day {day.day}
            </span>

            <h3 className="roadmap-day__focus">
                {day.focus}
            </h3>

        </div>

        <ul className="roadmap-day__tasks">

            {day.tasks.map((task, index) => (

                <li key={index}>

                    <span className="roadmap-day__bullet"></span>

                    {task}

                </li>

            ))}

        </ul>

    </div>

);
const Interview = () => {

    const [activeNav, setActiveNav] = useState("technical");

    const {
        report,
        loading,
        getReportById,
        getResumePdf
    } = useInterview();
    const { handleLogout } = useAuth();

    const { interviewId } = useParams();

    useEffect(() => {

        if (interviewId) {

            getReportById(interviewId);

        }

    }, [interviewId]);

    useEffect(() => {
        const timer = setTimeout(() => {
            const contentEl = document.querySelector(".interview-content");
            if (contentEl) {
                contentEl.scrollTop = 0;
            }
            window.scrollTo(0, 0);
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
        }, 0);
        return () => clearTimeout(timer);
    }, [activeNav]);



    if (loading || !report) {

        return (

            <main className="loading-screen">

                <h1>Loading your interview plan...</h1>

            </main>

        );

    }



    const scoreColor =
        report.maxScore >= 80
            ? "score--high"
            : report.maxScore >= 60
                ? "score--mid"
                : "score--low";



    return (

        <div className="interview-page">

            <div className="interview-layout">

                {/* LEFT SIDEBAR */}

                <nav className="interview-nav">

                    <div className="nav-content">

                        <p className="interview-nav__label">

                            Sections

                        </p>

                        {NAV_ITEMS.map(item => (

                            <button

                                key={item.id}

                                className={`interview-nav__item ${
                                    activeNav === item.id
                                        ? "interview-nav__item--active"
                                        : ""
                                }`}

                                onClick={() => setActiveNav(item.id)}

                            >

                                <span className="interview-nav__icon">

                                    {item.icon}

                                </span>

                                {item.label}

                            </button>

                        ))}

                    </div>

                    <button

                        className="button primary-button"

                        onClick={() => getResumePdf(interviewId)}

                    >

                        Download Resume

                    </button>

                    <button
                        onClick={handleLogout}
                        className="button"
                        style={{
                            marginTop: '15px',
                            backgroundColor: '#ef4444',
                            color: 'white',
                            border: 'none',
                            padding: '1rem',
                            borderRadius: '0.85rem',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'opacity 0.2s',
                            width: '100%',
                            boxShadow: '0 6px 18px rgba(239, 68, 68, 0.3)'
                        }}
                        onMouseOver={(e) => e.target.style.opacity = '0.8'}
                        onMouseOut={(e) => e.target.style.opacity = '1'}
                    >
                        Logout
                    </button>

                </nav>

                <div className="interview-divider"></div>

                {/* CENTER */}

                <main className="interview-content" key={activeNav}>

                    {activeNav === "technical" && (

                        <section>

                            <div className="content-header">

                                <h2>

                                    Technical Questions

                                </h2>

                                <span className="content-header__count">

                                    {report.technicalQuestions.length} Questions

                                </span>

                            </div>

                            <div className="q-list">

                                {report.technicalQuestions.map((question, index) => (

                                    <QuestionCard

                                        key={index}

                                        item={question}

                                        index={index}

                                    />

                                ))}

                            </div>

                        </section>

                    )}

                    {activeNav === "behavioral" && (

                        <section>

                            <div className="content-header">

                                <h2>

                                    Behavioral Questions

                                </h2>

                                <span className="content-header__count">

                                    {report.behavioralQuestions.length} Questions

                                </span>

                            </div>

                            <div className="q-list">

                                {report.behavioralQuestions.map((question, index) => (

                                    <QuestionCard

                                        key={index}

                                        item={question}

                                        index={index}

                                    />

                                ))}

                            </div>

                        </section>

                    )}

                    {activeNav === "roadmap" && (

                        <section>

                            <div className="content-header">

                                <h2>

                                    Preparation Road Map

                                </h2>

                                <span className="content-header__count">

                                    {report.preparationPlan.length} Days

                                </span>

                            </div>

                            <div className="roadmap-list" ref={el => {
                                if (el) {
                                    const parent = el.closest(".interview-content");
                                    if (parent) {
                                        parent.scrollTop = 0;
                                        setTimeout(() => {
                                            parent.scrollTop = 0;
                                        }, 100);
                                    }
                                }
                            }}>

                                {report.preparationPlan.map(day => (

                                    <RoadMapDay

                                        key={day.day}

                                        day={day}

                                    />

                                ))}

                            </div>

                        </section>

                    )}

                </main>

                <div className="interview-divider"></div>
                                {/* RIGHT SIDEBAR */}

                <aside className="interview-sidebar">

                    {/* Match Score */}

                    <div className="match-score">

                        <p className="match-score__label">

                            Match Score

                        </p>

                        <div className={`match-score__ring ${scoreColor}`}>

                            <span className="match-score__value">

                                {report.maxScore}

                            </span>

                            <span className="match-score__pct">

                                %

                            </span>

                        </div>

                        <p className="match-score__sub">

                            {report.maxScore >= 80
                                ? "Excellent match for this role"
                                : report.maxScore >= 60
                                    ? "Good match for this role"
                                    : "Needs improvement"}

                        </p>

                    </div>

                    <div className="sidebar-divider"></div>

                    {/* Skill Gaps */}

                    <div className="skill-gaps">

                        <p className="skill-gaps__label">

                            Skill Gaps

                        </p>

                        <div className="skill-gaps__list">

                            {report.skillGaps.map((gap, index) => (

                                <span
                                    key={index}
                                    className={`skill-tag skill-tag--${gap.severity}`}
                                >

                                    {gap.skill}

                                </span>

                            ))}

                        </div>

                    </div>

                </aside>

            </div>

        </div>

    );

};

export default Interview;