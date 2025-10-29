import { useGSAP } from '@gsap/react'
import React, { useState, useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/all'
import AnimatedTitle from './AnimatedTitle';
gsap.registerPlugin(ScrollTrigger);

// Shuffle Text Component - Enhanced for dramatic effect
const ShuffleText = ({ text, className, trigger }) => {
    const [displayText, setDisplayText] = useState('')
    const intervalRef = useRef(null)
    
    useEffect(() => {
        if (!trigger) return
        
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%&*"
        let iteration = 0
        
        // Start after a small delay when triggered
        const startTimer = setTimeout(() => {
            clearInterval(intervalRef.current)
            
            intervalRef.current = setInterval(() => {
                setDisplayText(
                    text.split("").map((letter, index) => {
                        if(index < iteration) {
                            return text[index]
                        }
                        if(letter === " ") return " "
                        return letters[Math.floor(Math.random() * letters.length)]
                    }).join("")
                )
                
                if(iteration >= text.length) {
                    clearInterval(intervalRef.current)
                }
                
                iteration += 0.3
            }, 50)
        }, 400)
        
        return () => {
            clearTimeout(startTimer)
            clearInterval(intervalRef.current)
        }
    }, [text, trigger])
    
    return (
        <span 
            className={className}
            style={{
                display: 'inline-block',
                fontFamily: 'monospace',
                letterSpacing: '0.02em',
                minHeight: '1em'
            }}
        >
            {displayText || text}
        </span>
    )
}

// Animated Description Component - word by word reveal
const AnimatedDescription = ({ text, className }) => {
    const words = text.split(' ')
    const [visibleWords, setVisibleWords] = useState(0)
    
    useEffect(() => {
        const timer = setTimeout(() => {
            const interval = setInterval(() => {
                setVisibleWords(prev => {
                    if (prev >= words.length) {
                        clearInterval(interval)
                        return prev
                    }
                    return prev + 1
                })
            }, 80) // Reveal one word every 80ms
            
            return () => clearInterval(interval)
        }, 1200) // Start after shuffle completes
        
        return () => clearTimeout(timer)
    }, [words.length])
    
    return (
        <p className={className}>
            {words.map((word, index) => (
                <span
                    key={index}
                    style={{
                        opacity: index < visibleWords ? 1 : 0,
                        transform: index < visibleWords ? 'translateY(0)' : 'translateY(10px)',
                        display: 'inline-block',
                        marginRight: '0.25em',
                        transition: 'all 0.3s ease-out',
                        filter: index < visibleWords ? 'blur(0px)' : 'blur(4px)'
                    }}
                >
                    {word}
                </span>
            ))}
        </p>
    )
}


const About = ({ alternateContent }) => {
    const [showAlternate, setShowAlternate] = useState(false)
    const showAlternateRef = useRef(false)
    const altTlRef = useRef(null)

    useGSAP(()=>{
        const clipAnimation = gsap.timeline({
            scrollTrigger:{
                trigger: "#clip",
                start: 'center center',
                end: '+=800 center',
                scrub: 0.5,
                pin: true,
                pinSpacing: true,
                // toggle alternate content when fully revealed
                onUpdate: self => {
                    if(self.progress > 0.98 && !showAlternateRef.current){
                        showAlternateRef.current = true
                        setShowAlternate(true)
                    } else if(self.progress < 0.5 && showAlternateRef.current){
                        showAlternateRef.current = false
                        setShowAlternate(false)
                    }
                }
            }
        })

        clipAnimation.to('.mask-clip-path',{
            width: '100vw',
            height: '100vh',
            borderRadius: 0
        })

        return ()=>{
            // cleanup any ScrollTriggers created by this component
            ScrollTrigger.getAll().forEach(t => t.kill())
        }
    })

    // animate transition between primary (image) and alternate content
    useEffect(()=>{
        // kill any previous timeline
        if(altTlRef.current){
            altTlRef.current.kill()
            altTlRef.current = null
        }

        if(showAlternate){
            // fade out primary and reveal container
            gsap.to('.primary-content', { autoAlpha: 0, duration: 0.5 })
            gsap.to('.alternate-content', { autoAlpha: 1, y: 0, duration: 0.6 })

            // create a timeline for image entrances and text fade-ins
            const tl = gsap.timeline()

            // images: 1 from left, 2 from right, 3 from top, 4 from bottom
            tl.from('.alt-img-1', { x: -120, autoAlpha: 0, duration: 0.6, ease: 'power3.out' }, 0.1)
            tl.from('.alt-img-2', { x: 120, autoAlpha: 0, duration: 0.6, ease: 'power3.out' }, 0.18)
            tl.from('.alt-img-3', { y: -120, autoAlpha: 0, duration: 0.6, ease: 'power3.out' }, 0.26)
            tl.from('.alt-img-4', { y: 120, autoAlpha: 0, duration: 0.6, ease: 'power3.out' }, 0.34)

            // text: heading then paragraphs then CTA with enhanced fade-in
            tl.from('.alt-heading', { y: 18, autoAlpha: 0, duration: 0.6, ease: 'power3.out' }, 0.42)
            tl.from('.alt-para', { 
                y: 20, 
                autoAlpha: 0, 
                duration: 0.8, 
                ease: 'power3.out',
                onStart: () => {
                    // Additional word-by-word fade if needed
                    gsap.from('.alt-para', {
                        filter: 'blur(8px)',
                        duration: 0.6,
                        ease: 'power2.out'
                    })
                }
            }, 0.6)
            tl.from('.alt-cta', { scale: 0.95, autoAlpha: 0, duration: 0.5, ease: 'back.out(1.2)' }, 0.9)

            altTlRef.current = tl

            // Add GSAP-powered hover effects with video playback
            setTimeout(() => {
                document.querySelectorAll('.alt-img').forEach((card, index) => {
                    const video = card.querySelector('video')
                    const img = card.querySelector('img')
                    
                    card.addEventListener('mouseenter', () => {
                        // Fade out image and fade in video
                        if (video && img) {
                            gsap.to(img, { autoAlpha: 0, duration: 0.4 })
                            gsap.to(video, { autoAlpha: 1, duration: 0.4 })
                            video.play().catch(err => console.log('Video play failed:', err))
                        }
                        
                        // Scale animation on the card
                        gsap.to(card, {
                            scale: index === 2 ? 1.05 : 1.03,
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
                            y: -4,
                            duration: 0.4,
                            ease: 'power2.out'
                        })
                    })

                    card.addEventListener('mouseleave', () => {
                        // Fade in image and fade out video
                        if (video && img) {
                            video.pause()
                            video.currentTime = 0
                            gsap.to(video, { autoAlpha: 0, duration: 0.4 })
                            gsap.to(img, { autoAlpha: 1, duration: 0.4 })
                        }
                        
                        // Reset card scale
                        gsap.to(card, {
                            scale: 1,
                            boxShadow: card.classList.contains('shadow-2xl') 
                                ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                                : '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                            y: 0,
                            duration: 0.4,
                            ease: 'power2.inOut'
                        })
                    })
                })
            }, 1000)
        } else {
            // hide alternate and bring back primary
            gsap.to('.alternate-content', { autoAlpha: 0, y: 30, duration: 0.35 })
            gsap.to('.primary-content', { autoAlpha: 1, duration: 0.45 })
        }

        return ()=>{
            if(altTlRef.current){
                altTlRef.current.kill()
                altTlRef.current = null
            }
        }
    }, [showAlternate])

  return (
    <div id='about' className='min-h-screen w-screen'>
        <div className='relative mb-8 mt-36 flex flex-col items-center gap-5'>
            <h2 className='font-general text-sm uppercase md:text-[10px]'>
                Welcome to Earth Sight
            </h2>
            <AnimatedTitle title=" Disc<b>o</b>ver the world's <br/>l<b>a</b>rgest shared adventure"
            containerClass="mt-5 !text-black text-center"/>
            
            <div className='about-subtext'>
                <p> The Change begins — your data, now shaping a greener future</p>
                <p>EarthSlight empowers you to see, predict, and protect Earth's evolving story</p>

            </div>
        </div>
        <div className='h-dvh w-screen' id='clip'>
            <div className='mask-clip-path about-image relative overflow-hidden'>
                {/* primary visual (image) */}
                <img
                src='img/slider1.jpg'
                alt='Background'
                className='primary-content absolute left-0 top-0 size-full object-cover'/>

                {/* alternate content shown when the mask is fully revealed */}
                <div
                    className='alternate-content absolute inset-0 flex items-center justify-center p-8 text-slate-900'
                    style={{ opacity: 0, transform: 'translateY(30px)' }}>
                    {/* default alternate content (About Us) if none provided via prop */}
                    {alternateContent ? (
                        alternateContent
                    ) : (
                        <div className='w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-16 items-center px-8'>
                            {/* left: short headline + supporting text */}
                            <div className='about-panel-text flex flex-col justify-center'>
                                <h3 className='alt-heading text-5xl md:text-6xl font-black leading-[1.1] text-slate-900 mb-6'>
                                    <ShuffleText text="What we are" className="inline-block" trigger={showAlternate} />
                                </h3>
                                <AnimatedDescription 
                                    text="We're a data-driven platform that connects satellite intelligence with real-world insight. At EarthSlight, we monitor the planet's health — tracking deforestation, mining, and environmental risks, while also predicting real estate trends with AI-powered analytics. Our goal? To make the Earth more transparent, one pixel at a time. 🌎"
                                    className="alt-para text-base md:text-lg text-slate-600 mb-6 leading-relaxed"
                                />
                                <a href='#' className='alt-cta inline-block px-6 py-3 bg-transparent border-2 border-emerald-500 text-emerald-600 rounded-full font-semibold hover:bg-emerald-50 transition-colors w-max'>Read More</a>
                            </div>

                            {/* right: independent containers with manual positioning */}
                            <div className='about-panel-grid relative w-full'>
                                {/* Left column wrapper */}
                                <div className='float-left w-1/2 pr-2'>
                                    {/* Top-left: Small card - Modern interior */}
                                    <div className='alt-img alt-img-1 rounded-3xl overflow-hidden shadow-lg cursor-pointer h-52 md:h-60 mb-4 relative'>
                                        <img src='/img/nature.jpg' alt='Modern interior' className='w-full h-full object-cover absolute inset-0' />
                                        <video 
                                            src='/videos/Switzerland 🇨🇭 _ Beautiful__.mp4' 
                                            className='w-full h-full object-cover absolute inset-0 opacity-0'
                                            muted
                                            loop
                                            playsInline
                                        />
                                    </div>

                                    {/* Bottom-left: Large card - Heritage building */}
                                    <div className='alt-img alt-img-3 rounded-3xl overflow-hidden shadow-xl cursor-pointer h-80 md:h-96 relative'>
                                        <img src='/img/nature building.webp' alt='Heritage building' className='w-full h-full object-cover absolute inset-0' />
                                        <video 
                                            src='/videos/YTDown.com_Shorts_Most-Impressive-Green-Buildings-in-the-w_Media_SEcZbyk8v44_001_1080p.mp4' 
                                            className='w-full h-full object-cover absolute inset-0 opacity-0'
                                            muted
                                            loop
                                            playsInline
                                        />
                                    </div>
                                </div>

                                {/* Right column wrapper */}
                                <div className='float-left w-1/2 pl-2'>
                                    {/* Top-right: LARGE card - Villa exterior */}
                                    <div className='alt-img alt-img-2 rounded-3xl overflow-hidden shadow-lg cursor-pointer h-80 md:h-96 mb-4 relative'>
                                        <img src='/img/building.jpg' alt='Villa exterior' className='w-full h-full object-cover absolute inset-0' />
                                        <video 
                                            src='/videos/video.mp4' 
                                            className='w-full h-full object-cover absolute inset-0 opacity-0'
                                            muted
                                            loop
                                            playsInline
                                        />
                                    </div>

                                    {/* Bottom-right: Small card - Homesuit */}
                                    <div className='alt-img alt-img-4 rounded-3xl overflow-hidden shadow-lg cursor-pointer h-52 md:h-60 relative'>
                                        <img src='/img/deforestion.jpg' alt='Home suite' className='w-full h-full object-cover absolute inset-0' />
                                        <video 
                                            src='/videos/Madagascar Deforestation.mp4' 
                                            className='w-full h-full object-cover absolute inset-0 opacity-0'
                                            muted
                                            loop
                                            playsInline
                                        />
                                    </div>
                                </div>
                                
                                <div className='clear-both'></div>
                            </div>
                        </div>
                    )}
                </div>

            </div>

        </div>

    </div>
  )
}

export default About
