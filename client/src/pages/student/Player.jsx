import React, { useState, useEffect, useContext } from 'react'
import { AppContext } from '../../context/AppContex';
import { useParams } from 'react-router-dom';
import { assets } from '../../assets/assets';
import humanizeDuration from 'humanize-duration'
import YouTube from 'react-youtube';
import Footer from '../../components/student/Footer';
import Rating from '../../components/student/Rating';



const Player = () => {

    const { enrolledCourses, calculateChapterTime } = useContext(AppContext)
    const { courseId, lectureId } = useParams()
    const [courseData, setCourseData] = useState(null);
    const [openSections, setOpenSections] = useState({});
    const [playerData, setPlayerData] = useState(null);
    const [previewVideoId, setPreviewVideoId] = useState(null);

    const getCourseData = () => {
        const found = (enrolledCourses || []).find(course => course._id === courseId);
        if (found) setCourseData(found);
    }
    const toggleSection = (index) => {
        setOpenSections(prevState => ({
            ...prevState,
            [index]: !prevState[index]
        }));
    };


    useEffect(() => {
        getCourseData();
    }, [courseId, enrolledCourses])

    // If we navigated to this page without selecting a lecture, auto-select the first available lecture
    useEffect(() => {
        if (!courseData || playerData) return;
        const chapters = courseData.courseContent || [];
        for (let ci = 0; ci < chapters.length; ci++) {
            const ch = chapters[ci];
            if (Array.isArray(ch.chapterContent) && ch.chapterContent.length) {
                const lec = ch.chapterContent[0];
                if (lec) {
                    setPlayerData({ ...lec, chapter: ci + 1, lecture: 1 });
                    break;
                }
            }
        }
    }, [courseData, playerData]);
    return (
        <>
            <div className='p-4 sm:p10 flex flex-col-reverse md:grid
         md:grid-cols-2 gap-10 md:px-36'>
                {/*left column */}
                <div className='text-gray-800'>
                    <h2 className='text-xl font-semibold'>Course Structure</h2>
                    <div className='pt-5'>
                        {Array.isArray(courseData?.courseContent) && courseData.courseContent.map((chapter, index) => (
                            <div key={index} className='border border-gray-300 bg-white mb-2 rounded'>
                                <div className='flex items-center justify-between px-4 py-3 
                                cursor-pointer select-none' onClick={() => toggleSection(index)}>
                                    <div className='flex items-center gap-2'>
                                        <img className={`transform transition-transform ${openSections[index] ? 'rotate-180' : ''}`} src={assets.down_arrow_icon} alt="arrow icon" />
                                        <p className='font-medium md:text-base text-sm'>{chapter.chapterTitle}</p>
                                    </div>
                                    <p className='text-sm md:text-default'>{(Array.isArray(chapter.chapterContent) ? chapter.chapterContent.length : 0)} Lectures - {calculateChapterTime(chapter)}</p>
                                </div>

                                <div className={`overflow-hidden transition-all duration-300 ${openSections[index] ? 'max-h-96' : 'max-h-0'}`}>
                                    <ul className='list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600 border-t border-gray-300'>
                                        {Array.isArray(chapter.chapterContent) && chapter.chapterContent.map((lecture, i) => (
                                            <li key={i} className='flex items-start gap-2 py-1'>
                                                <img src={false ? assets.blue_tick_icon : assets.play_icon} alt="play icon" className='w-4 h-4 
                                                mt-1' />
                                                <div className='flex items-center justify-between w-full text-gray-800 text-xs md:text-default'>
                                                    <p>{lecture.lectureTitle}</p>
                                                    <div className='flex gap-2'>
                                                        {lecture.lectureUrl && (
                                                            <button
                                                                type='button'
                                                                onClick={() => setPlayerData({
                                                                    ...lecture, chapter: index + 1, lecture: i + 1
                                                                })}

                                                                className='text-blue-500 cursor-pointer underline text-sm'
                                                            >
                                                                Watch
                                                            </button>
                                                        )}
                                                        <p>{humanizeDuration((Number(lecture.lectureDuration) || 0) * 60 * 1000, { units: ['h', 'm'] })}</p>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className='flex items-center gap-2 py-3 mt-10'>
                        <h1 className='text-xl font-bold'>Rate this course:</h1>
                        <Rating intialRating={0} />
                    </div>
                </div>

                {/*right column */}
                <div className='md:mt-10'>
                    {playerData ? (
                        <div>
                            <YouTube videoId={playerData.lectureUrl.split('/').pop()}
                                iframeClassName="w-full aspect-video" />
                            <div className='flex justify-between items-center mt-1'>
                                <p>{playerData.chapter}.{playerData.lecture}{playerData.lectureTitle}</p>
                            </div>
                            <button className='text-blue-600'>{false ? 'Completed' : 'Mark Complete'}</button>
                        </div>
                    )
                        :
                        <img src={courseData ? courseData.courseThumbnail : ''} alt="" />}
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Player
