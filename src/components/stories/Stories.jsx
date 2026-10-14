import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import openAxios from '../../api/axios';
import { getImageUrl } from '../../utils/imageUrl';
import './Stories.css';

const isVideo = (url) => /\.(mp4|webm)(\?|$)/i.test(url);

// Гифка и видео ведут себя одинаково — крутятся без звука и без управления
const Media = ({ url, alt, className }) =>
  isVideo(url) ? (
    <video className={className} src={url} muted loop autoPlay playsInline preload="metadata" />
  ) : (
    <img className={className} src={url} alt={alt} loading="lazy" />
  );

const Viewer = ({ stories, index, onClose, onNavigate }) => {
  const navigate = useNavigate();
  const story = stories[index];

  // Ссылку из админки принимаем в любом виде: путь, путь без слэша или
  // полный адрес. Свой адрес сводим к пути, чужой открываем в новой вкладке.
  const openLink = (raw) => {
    const link = (raw || '').trim();
    if (!link) return;

    if (/^https?:\/\//i.test(link)) {
      try {
        const url = new URL(link);
        if (url.origin === window.location.origin) {
          onClose();
          navigate(`${url.pathname}${url.search}${url.hash}`);
          return;
        }
      } catch {
        // Адрес не разобрался — считаем внешним
      }
      window.open(link, '_blank', 'noopener');
      return;
    }

    onClose();
    navigate(link.startsWith('/') ? link : `/${link}`);
  };

  // Клавиатура: стрелки листают, Esc закрывает
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNavigate(1);
      if (e.key === 'ArrowLeft') onNavigate(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, onNavigate]);

  // Пока просмотр открыт, страница под ним не прокручивается
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, []);

  return (
    <div className="stories-viewer" role="dialog" aria-modal="true">
      <div className="stories-viewer-bar">
        {stories.map((s, i) => (
          <span key={s.id} className={`stories-viewer-tick ${i === index ? 'on' : ''}`} />
        ))}
      </div>

      <button type="button" className="stories-viewer-close" onClick={onClose} aria-label="Закрыть">
        <img src="/close.png" alt="" />
      </button>

      <Media url={getImageUrl(story.media)} alt={story.title} className="stories-viewer-media" />

      {/* Половины кадра листают вперёд и назад, как в сторис */}
      <button
        type="button"
        className="stories-viewer-half stories-viewer-prev"
        onClick={() => onNavigate(-1)}
        aria-label="Назад"
      />
      <button
        type="button"
        className="stories-viewer-half stories-viewer-next"
        onClick={() => onNavigate(1)}
        aria-label="Вперёд"
      />

      <div className="stories-viewer-foot">
        <p className="stories-viewer-title">{story.title}</p>
        {story.link && (
          <button
            type="button"
            className="stories-viewer-btn"
            onClick={() => openLink(story.link)}
          >
            В каталог
          </button>
        )}
      </div>
    </div>
  );
};

const Stories = () => {
  const [stories, setStories] = useState([]);
  const [openAt, setOpenAt] = useState(null);

  useEffect(() => {
    openAxios.get('/api/stories/')
      .then((res) => setStories(res.data))
      .catch(() => setStories([]));
  }, []);

  const navigateBy = useCallback((step) => {
    setOpenAt((current) => {
      if (current === null) return current;
      const next = current + step;
      // Доходим до края — закрываем, как в сторис
      return next < 0 || next >= stories.length ? null : next;
    });
  }, [stories.length]);

  if (stories.length === 0) return null;

  return (
    <>
      <section className="stories">
        <div className="stories-track">
          {stories.map((story, i) => (
            <button
              key={story.id}
              type="button"
              className="stories-tile"
              onClick={() => setOpenAt(i)}
            >
              <Media url={getImageUrl(story.media)} alt={story.title} className="stories-tile-media" />
              <span className="stories-tile-title">{story.title}</span>
            </button>
          ))}
        </div>
      </section>

      {openAt !== null && (
        <Viewer
          stories={stories}
          index={openAt}
          onClose={() => setOpenAt(null)}
          onNavigate={navigateBy}
        />
      )}
    </>
  );
};

export default Stories;
