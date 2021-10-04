/* eslint-disable no-fallthrough */
import React from "react"
import "./Movie.scss"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react/cjs/react.development"
import { fetchMovieInfo, fetchMovieCredits } from "../../fetchingData"
import Loader from "../Loader/Loader"
import MovieBanner from "./MovieBanner/MovieBanner"
import NotFoundPage from "../NotFoundPage/NotFoundPage"
import ActorItem from "../ActorItem/ActorItem"
import { useDispatch, useSelector } from "react-redux"

import { 
  setActorsAction, 
  setArtAction, 
  setBackgroundAction, 
  setCameraAction, 
  setDirectorAction, 
  setEditorAction, 
  setImageAction, 
  setInfoAction, 
  setPremiereAction, 
  setProducerAction, 
  setScreenplayAction, 
  setSoundAction, 
  setYearAction,
 } from "../../store/reducers/moviePageReducer"
import Navbar from "../Navbar/Navbar"

export default function Movie() {
  const dispatch = useDispatch()
  const [isLoaded, setIsLoaded] = useState(false)
  const [isError, setIsError] = useState(false)

  const { movieId } = useParams()

  const {
    info, 
    image, 
    background,
    actors,
    year,
    premiere,
    screenplay,
    director,
    producer,
    camera,
    sound,
    art,
    editor
  } = useSelector(state => state.moviePage)

  const getMovieCredits = data => {
    data.map(i => {
      if (i.job === "Director") {
        dispatch(setDirectorAction(i.name))
      }
      if (i.job === "Screenplay" || i.job === "Writer") {
        dispatch(setScreenplayAction(i.name))
      }
      if (
        i.job === "Producer"
      ) {
        dispatch(setProducerAction(i.name))
      }
      if (i.job === "Director of Photography" || i.job === "Cinematography") {
        dispatch(setCameraAction(i.name))
      }
      if (i.job === "Original Music Composer" || i.job === "Music") {
        dispatch(setSoundAction(i.name))
      }
      if (
        i.job === "Art Direction"
      ) {
        dispatch(setArtAction(i.name))
      }
      if (i.job === "Editor") {
        dispatch(setEditorAction(i.name))
      }
      return null
    })
  }

  useEffect(() => {
    setIsLoaded(false)
    fetchMovieInfo(movieId)
      .then(res => {
        dispatch(setInfoAction(res))
        const realiseDate = new Date(res.year)
        const getYear = realiseDate.getFullYear()
        const premiereDate = realiseDate.toLocaleString("ru", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
        dispatch(setYearAction(getYear))
        dispatch(setPremiereAction(premiereDate))
        dispatch(setImageAction(res.image))
        dispatch(setBackgroundAction(res.background))
        setIsLoaded(true)
      })
      .catch(e => {
        console.log("not found")
        setIsError(true)
        setIsLoaded(true)
      })

    fetchMovieCredits(movieId)
      .then(res => {
        dispatch(setActorsAction(res.cast))
        getMovieCredits(res.crew)
      })
      .catch(e => {
        console.log("credits error")
        setIsError(true)
        setIsLoaded(true)
      })
  }, [movieId])

  console.log(screenplay);

  return (
    <>
      {isLoaded && !isError ? (
        <>
          <Navbar />
          <div className="movie">
            <MovieBanner
              image={image}
              background={background}
              info={info}
              isError={isError}
              isLoaded={isLoaded}
            />
            <div className="container">
              {Object.keys(info).length > 0 && actors.length > 2 && (
                <div className="movie_credits">
                  <div className="about__title">О фильме</div>
                  <div className="credit__year credit__item">
                    <span>Год:</span> {year}
                  </div>
                  <div className="credit__country credit__item">
                    <span>Страна:</span>
                    {info.country.length > 0 ? (
                      info.country.map(c => {
                        return (
                          <span key={c.name} className="many">
                            {" "}
                            {c.name}
                          </span>
                        )
                      })
                    ) : (
                      <>?</>
                    )}
                  </div>
                  <div className="credit__genre credit__item">
                    <span>Жанр: </span>
                    {info.genre.map(g => {
                      return (
                        <span key={g.name} className="many">
                          {" "}
                          {g.name}
                        </span>
                      )
                    })}
                  </div>
                  <div className="credit__slogan credit__item">
                    <span>Слоган:</span>{" "}
                    {info.slogan ? <>{info.slogan}</> : "—"}
                  </div>
                  <div className="credit__director credit__item">
                    <span>Режиссер:</span> {director}
                  </div>
                  <div className="credit__screenplay credit__item">
                    <span>Сценарий:</span> {screenplay.length > 0 ? screenplay.map(i => <span className="many">{i}</span>) : '?'}
                  </div>
                  <div className="credit__producer credit__item">
                    <span>Продюсер:</span> {producer.length > 0 ? producer.map(i => <span className="many">{i}</span>) : '?'}
                  </div>
                  <div className="credit__camera credit__item">
                    <span>Оператор:</span> {camera.length > 0 ? camera.map(i => <span className="many">{i}</span>) : '?'}
                  </div>
                  <div className="credit__sound credit__item">
                    <span>Композитор:</span> {sound.length > 0 ? sound.map(i => <span className="many">{i}</span>) : '?'}
                  </div>
                  <div className="credit__art credit__item">
                    <span>Художник:</span> {art.length > 0 ? art.map(i => <span className="many">{i}</span>) : '?'}
                  </div>
                  <div className="credit__editor credit__item">
                    <span>Монтаж:</span> {editor ? editor.map(i => <span className="many">{i}</span>) : '?'}
                  </div>
                  <div className="credit__premiere credit__item">
                    <span>Премьера в мире:</span> {premiere}
                  </div>
                  <div className="credit__time credit__item">
                    <span>Время:</span> {Math.trunc(info.runtime / 60)}ч.{" "}
                    {info.runtime % 60}мин.
                  </div>
                </div>
              )}
            </div>
            {actors.length > 0 && 
              <div className="actors">
                <div className="container">
                  <div className="actors__title">Актеры</div>
                  <div className="actors__wrapper">
                    {actors.map(a => {
                      return <ActorItem key={a.id} actor={a} />
                    })}
                  </div>
                </div>
              </div>}
          </div>
        </>
      ) : isLoaded && isError ? (
        <NotFoundPage />
      ) : (
        <Loader />
      )}
    </>
  )
}
