/* eslint-disable react/prop-types */
import { MOBILE_MAX_WIDTH } from '../utils/imageUrl';

/**
 * Фото, у которого в админке два файла: первое для компьютера, второе —
 * для телефона и планшета. Нужный выбирает браузер, лишний не грузится.
 * Второго файла нет — везде показывается первое.
 *
 * Обёртка <picture> в раскладке не участвует (picture { display: contents }
 * в index.css), поэтому размеры и object-fit у картинки остаются прежними.
 */
const AdaptiveImage = ({ src, srcMobile, alt, ...rest }) => {
  const основное = src || srcMobile;
  if (!основное) return null;

  return (
    <picture>
      {srcMobile && (
        <source media={`(max-width: ${MOBILE_MAX_WIDTH}px)`} srcSet={srcMobile} />
      )}
      <img src={основное} alt={alt} {...rest} />
    </picture>
  );
};

export default AdaptiveImage;
