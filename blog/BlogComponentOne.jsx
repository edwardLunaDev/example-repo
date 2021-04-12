import React from "react";
import PropTypes from "prop-types";
import { formatDateTime } from "../../services/dateService";
import DOMPurify from "dompurify";

function BlogComponentOne(props) {
  const oneBlog = props.blog;

  const getBlogId = function () {
    props.onClick(oneBlog);
  };

  return (
    <div
      key={`${oneBlog.id}`}
      data-blog-id={oneBlog.id}
      onClick={getBlogId}
      className="blog-content-feature"
    >
      <img src={oneBlog.imageUrl} alt="featured-blog-img" />
      <div className="feature-blog-content">
        <h4 className="blog-preview-title">{oneBlog.title}</h4>
        <h6 className="blog-preview-date">
          {formatDateTime(oneBlog.dateCreated)}
        </h6>
        <div
          className="blog-preview-content"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(
              oneBlog.content.slice(0, 25) + "... read more"
            ),
          }}
        ></div>
      </div>
    </div>
  );
}

BlogComponentOne.propTypes = {
  blog: PropTypes.shape({
    id: PropTypes.number.isRequired,
    imageUrl: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string,
    dateCreated: PropTypes.string,
  }),
  slice: PropTypes.func,
  onClick: PropTypes.func.isRequired,
};

export default React.memo(BlogComponentOne);
