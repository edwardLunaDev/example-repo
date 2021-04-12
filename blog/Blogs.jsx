import React from "react";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import debug from "sabio-debug";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import BlogComponentOne from "./BlogComponentOne";
import BlogComponentTwo from "./BlogComponentTwo";
import BlogComponentThree from "./BlogComponentThree";
// import BreadCrumb from "../../layout/Breadcrumb";
import "./blogs.css";
import * as blogService from "../../services/blogService/blogServices";

const _logger = debug.extend("BlogDetails");
const ADD_BODY_CLASS = "blogs-body";

class Blogs extends React.Component {
  state = {
    mappedBlogs: [],
    mappedTopBlogs: [],
    mappedAllBlogs: [],
    currentPage: 1,
    totalCount: 3,
    pageSize: 7,
    isPublished: true,
  };

  componentDidMount() {
    this.renderBlogs(1);
    document.body.classList.add(ADD_BODY_CLASS);
  }

  renderBlogs = (page) => {
    blogService
      .getBlogs(page - 1, this.state.pageSize)
      .then(this.onGetBlogsSuccess)
      .catch(this.onGetBlogsError);
  };

  getBlogId = (aBlog) => {
    this.props.history.push(`/blog?id=${aBlog.id}`, aBlog);
  };

  onGetBlogsSuccess = (response) => {
    let blogs = response.item.pagedItems;

    const featuredBlog = blogs.slice(0, 1);
    const topBlogs = blogs.slice(1, 3);
    const allBlogs = blogs.slice(3, 8);
    blogs.splice(0, 3);
    _logger("topBlogs", topBlogs);

    this.setState((prevState) => {
      return {
        ...prevState,
        mappedBlogs: featuredBlog.map(this.mapBlog),
        mappedTopBlogs: topBlogs.map(this.mapTopBlog),
        mappedAllBlogs: allBlogs.map(this.mapBlogAll),
        totalCount: response.item.totalCount,
        pageSize: response.item.pageSize,
        currentPage: ++response.item.pageIndex,
      };
    });
  };
  
  onGetBlogsError = (response) => {
    _logger(response);
  };

  // BlogComponentOne - brings in large/featured blog post
  mapBlog = (oneBlog) => (
    <BlogComponentOne
      key={`${oneBlog.id}`}
      onClick={this.getBlogId}
      blog={oneBlog}
    ></BlogComponentOne>
  );

  // BlogComponentTwo - brings in two on the right side next to the main featured blog
  mapTopBlog = (topBlog) => (
    <BlogComponentTwo
      key={`${topBlog.id}`}
      onClick={this.getBlogId}
      blog={topBlog}
    ></BlogComponentTwo>
  );

  // BlogComponentThree - brings in the rest of the blogs - 4 at bottom
  mapBlogAll = (blogAll) => (
    <BlogComponentThree
      key={blogAll.id}
      onClick={this.getBlogId}
      blog={blogAll}
    />
  );

  render() {
    return (
      <React.Fragment>
        <div className="container main-blog-page-content-wrapper space-background">
          <div className="latest-header">
            <h1>Latest News...</h1>
          </div>
          <div className="row featured-items-row">
            <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
              {this.state.mappedBlogs}
            </div>
            <div className="col-lg-6 col-md-12 col-sm-12 featured-secondary">
              {this.state.mappedTopBlogs}
            </div>
          </div>
          <div className="row">{this.state.mappedAllBlogs}</div>
          <Pagination
            className="blogs-pagination"
            current={this.state.currentPage}
            total={this.state.totalCount}
            onChange={this.renderBlogs}
            pageSize={this.state.pageSize}
          />
        </div>
      </React.Fragment>
    );
  }
}

Blogs.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
};

export default withRouter(Blogs);
