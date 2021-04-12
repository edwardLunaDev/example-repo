import React from "react";
import PropTypes from "prop-types";
import { formatDateTime } from "../../services/dateService";
import DOMPurify from "dompurify";

function BlogComponentThree(props) {
  const allBlogs = props.blog;
  let allBlogsContent = allBlogs.content.slice(0, 100);

  const getBlogId = function () {
    props.onClick(allBlogs);
  };

  return (
    <div className="col-lg-3 col-md-6 col-sm-12">
      <div
        className="blog-content-preview-card-container"
        onClick={getBlogId}
        key={`${allBlogs.id}`}
      >
        <img src={allBlogs.imageUrl} alt="blog-preview-img" />
        <div className="blog-content-preview">
          <h4 className="blog-preview-title">{allBlogs.title}</h4>
          <h6 className="blog-preview-date">
            {formatDateTime(allBlogs.dateCreated)}
          </h6>
          <div
            className="blog-preview-content"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(allBlogsContent + "... read more"),
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}

BlogComponentThree.propTypes = {
  blog: PropTypes.shape({
    id: PropTypes.number.isRequired,
    imageUrl: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string,
    dateCreated: PropTypes.string,
  }),
  onClick: PropTypes.func.isRequired,
};

export default React.memo(BlogComponentThree);
