import React, { Fragment } from "react";
import PropTypes from "prop-types";
import DOMPurify from "dompurify";
import { Container, Row, Col, Media } from "reactstrap";
import debug from "sabio-debug";
import * as blogService from "../../services/blogService/blogServices";
import { formatDateTime } from "../../services/dateService";
import CommentsPage from "../comments/CommentsPage";

const _logger = debug.extend("BlogSingle");
const ADD_BODY_CLASS = "single-blog-body";

class SingleBlogs extends React.Component {
  state = {
    blogContent: {
      title: "",
      content: "",
      imageUrl: "",
      subject: "",
      datePublish: "",
      dateCreated: "",
      authorId: "",
    },
  };

  componentDidMount() {
    this.getCurrent();
    document.body.classList.add(ADD_BODY_CLASS);
  }

  getCurrent = () => {
    const thisBlog = this.props.location.search.split("=")[1];

    blogService
      .getBlogById(thisBlog)
      .then(this.onGetByIdSuccess)
      .catch(this.onGetByIdError);
  };

  onGetByIdSuccess = (response) => {
    let blogData = response.item;
    _logger(blogData);

    this.setState(() => {
      let singleBlog = { ...this.state };
      singleBlog.blogContent.title = blogData.title;
      singleBlog.blogContent.content = blogData.content;
      singleBlog.blogContent.imageUrl = blogData.imageUrl;
      singleBlog.blogContent.subject = blogData.subject;
      singleBlog.blogContent.dateCreated = blogData.dateCreated;
      return { singleBlog };
    });
  };

  onGetByIdError = (response) => {
    _logger(response);
  };

  render() {
    return (
      <Fragment>
        <Container fluid={true}>
          <Row>
            <Col sm="12">
              <div className="blog-single">
                <div className="blog-box">
                  <Media
                    className="img-fluid w-100 main-blog-image"
                    src={this.state.blogContent.imageUrl}
                    alt="blog-main"
                  />
                  <div className="blog-details">
                    <h1>{this.state.blogContent.title}</h1>
                    <ul className="blog-social">
                      <li className="digits">
                        {formatDateTime(this.state.blogContent.dateCreated)}
                      </li>
                      <li className="digits">
                        {this.state.blogContent.subject}
                      </li>
                    </ul>
                    <div
                      className="single-blog-content-top"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(
                          this.state.blogContent.content
                        ),
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>

        <CommentsPage
          entityId={parseInt(`${this.props.location.state.id}`)}
          entityTypeId={1}
          createdBy={this.props.location.state.authorId}
          currentUser={this.props.currentUser}
          isLogged={this.props.isLogged}
        />
      </Fragment>
    );
  }
}

SingleBlogs.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.number,
    email: PropTypes.string,
    name: PropTypes.string,
    roles: PropTypes.arrayOf(PropTypes.string),
    tenantId: PropTypes.string,
  }),
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
    state: PropTypes.shape({
      id: PropTypes.number.isRequired,
      authorId: PropTypes.number.isRequired,
    }),
  }),
  isLogged: PropTypes.bool,
};

export default SingleBlogs;
