import React, { createContext, useState, useEffect } from "react";
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {

    const currency = import.meta.env.VITE_CURRENCY || '$';
    const navigate = useNavigate();

    const [allCourses, setAllCourses] = useState([])
    const [isEducator, setIsEducator] = useState(true)
    const [enrolledCourses, setEnrolledCourses] = useState([])

    // fetch all courses (placeholder using dummy data)
    const fetchAllCourses = async () => {
        setAllCourses(dummyCourses)
    }

    // function to calculate avg rating of course
    const calculateRating = (course) => {
        if (course.courseRatings.length === 0) {
            return 0;
        }
        let totalRating = 0
        course.courseRatings.forEach(rating => {
            totalRating += rating.rating;
        })
        return totalRating / course.courseRatings.length
    }

    //Function to calculate course chapter time
    const calculateChapterTime = (chapter) => {
        // chapter expected to have chapterContent: [{ lectureDuration: number }, ...]
        if (!chapter || !Array.isArray(chapter.chapterContent)) return '0m'
        let time = 0
        chapter.chapterContent.forEach((lecture) => {
            time += Number(lecture.lectureDuration) || 0
        })
        return humanizeDuration(time * 60 * 1000, { units: ['h', 'm'] })
    }

    //function to calculate course duration
    const calculateCourseDuration = (course) => {
        if (!course || !Array.isArray(course.courseContent)) return '0m'
        let time = 0
        course.courseContent.forEach((chapter) => {
            if (Array.isArray(chapter.chapterContent)) {
                chapter.chapterContent.forEach((lecture) => {
                    time += Number(lecture.lectureDuration) || 0
                })
            }
        })
        return humanizeDuration(time * 60 * 1000, { units: ['h', 'm'] })
    }

    // function to callculate no of lectures in the course
    const calculateNoOfLectures = (course) => {
        let totalLectures = 0;
        course.courseContent.forEach(chapter => {
            if (Array.isArray(chapter.chapterContent)) {
                totalLectures += chapter.chapterContent.length;
            }
        });
        return totalLectures;
    }

    //Fetch all courses 
    const fetchEnrolledCourses = async () => {
        setEnrolledCourses(dummyCourses)
    }



    useEffect(() => {
        fetchAllCourses()
        fetchEnrolledCourses()
    }, [])

    const value = {
        currency,
        allCourses,
        navigate,
        calculateRating,
        isEducator,
        setIsEducator,
        calculateChapterTime,
        calculateCourseDuration,
        calculateNoOfLectures,
        enrolledCourses,
        fetchEnrolledCourses
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )

}
