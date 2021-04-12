import React from "react";
import PropTypes from "prop-types";
import { formatDateTime } from "../../services/dateService";
import DOMPurify from "dompurify";

function BlogComponentTwo(props) {
  // topBlog is to map through the top two smaller blog entries next to the main featured blog entry
  const topBlog = props.blog;

  const getBlogId = function () {
    props.onClick(topBlog);
  };

  return (
    <div
      onClick={getBlogId}
      key={`${topBlog.id}`}
      className="featured-blog-secondary"
    >
      <img src={topBlog.imageUrl} alt="feature-img" />
      <div className="featured-secondary-content">
        <h4 className="blog-preview-title">{topBlog.title}</h4>
        <h6 className="blog-preview-date">
          {formatDateTime(topBlog.dateCreated)}
        </h6>
        <div
          className="blog-preview-content"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(
              topBlog.content.slice(0, 50) + "... read more"
            ),
          }}
        ></div>
      </div>
    </div>
  );
}

BlogComponentTwo.propTypes = {
  blog: PropTypes.shape({
    id: PropTypes.number.isRequired,
    // imageUrl: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    dateCreated: PropTypes.string,
  }),
  onClick: PropTypes.func.isRequired,
};

export default React.memo(BlogComponentTwo);
