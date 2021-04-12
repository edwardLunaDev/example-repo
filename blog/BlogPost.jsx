import React from "react";
import CKEditor from "react-ckeditor-component";
import debug from "sabio-debug";
import "./blogs.css";
import * as uploadService from "../../services/fileUploadService";
import { Formik, Form, ErrorMessage, Field } from "formik";
import { blogPostSchema } from "./blogPostSchema";
import * as blogService from "../../services/blogService/blogServices";
import PropTypes from "prop-types";
import Swal from "sweetalert2";

import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Label,
} from "reactstrap";

const _logger = debug.extend("BlogPost");

const defaultState = {
  isReady: false,
  formData: {
    blogTypeId: "",
    authorId: 2,
    title: "",
    subject: "",
    content: "",
    isPublished: true,
    imageUrl: "",
  },
  blogTypes: null,
};

class BlogPost extends React.Component {
  state = { ...defaultState };

  static getDerivedStateFromProps(props, state) {
    if (props.location.state && !state.isReady) {
      const newState = {
        isReady: true,
        formData: {
          blogTypeId: props.location.state.blogTypeId,
          authorId: props.location.state.authorId,
          title: props.location.state.title,
          subject: props.location.state.subject,
          content: props.location.state.content,
          isPublished: props.location.state.isPublished,
          imageUrl: props.location.state.imageUrl,
          blogFile: props.location.state.blogFile,
        },
        blogTypes: [],
      };
      return newState;
    }
    return null;
  }

  componentDidMount() {
    this.blogTypes();
  }

  blogTypes = () => {
    blogService
      .getBlogType()
      .then(this.getBlogTypeSuccess)
      .catch(this.getBlogTypeError);
  };

  getBlogTypeSuccess = (response) => {
    this.setState((prevState) => {
      return {
        ...prevState,
        blogTypes: response.item.map(this.mapItem),
      };
    });
  };

  onPost = (values, { setSubmitting }) => {
    values.blogTypeId = parseInt(values.blogTypeId);
    if (this.props.location.state) {
      const payload = { ...values, id: this.props.location.state.id };
      blogService
        .updateBlog(payload)
        .then(this.onUpdateSuccess)
        .catch(this.onUpdateError)
        .finally(() => setSubmitting(false));
    } else {
      blogService
        .createBlog(values)
        .then(this.onCreateBlogSuccess)
        .catch(this.onCreateBlogError)
        .finally(() => setSubmitting(false));
    }
  };

  onUpdateSuccess = () => {
    Swal.fire("Blog Updated!", "Success");
    this.props.history.push("/blog/blogList");
  };

  onCreateBlogSuccess = () => {
    Swal.fire("Blog Created!", "Success!");
    this.props.history.push(`/blog/blogList`);
  };

  mapItem = (item) => (
    <option key={item.id} value={item.id}>
      {item.name}
    </option>
  );

  handleUpload = (e, setFieldValue) => {
    let currentUploadName = e.target.files[0];

    uploadService
      .fileUpload(currentUploadName)
      .then((response) => this.onUploadSuccess(response, setFieldValue))
      .catch(this.onUploadError);
  };

  onUploadSuccess = (response, setFieldValue) => {
    setFieldValue("imageUrl", response.item.url);
  };

  onUploadError = (errResponse) => {
    _logger(errResponse);
  };

  render() {
    return (
      <React.Fragment>
        <Container fluid={true}>
          <Row>
            <Col sm="12">
              <Card>
                <CardHeader>
                  <h5>Post Edit</h5>
                </CardHeader>
                <CardBody className="add-post">
                  <Formik
                    initialValues={this.state.formData}
                    validationSchema={blogPostSchema}
                    onSubmit={this.onPost}
                    enableReinitialize={true}
                  >
                    {({ isSubmitting, setFieldValue, values }) => (
                      <Form className="row needs-validation">
                        <Col sm="12">
                          <FormGroup>
                            <Label htmlFor="title">Title:</Label>
                            <ErrorMessage
                              name="title"
                              component="span"
                              className="text-danger float-right"
                            ></ErrorMessage>
                            <Field
                              className="form-control"
                              name="title"
                              type="text"
                              id="title"
                              placeholder="Blog Title"
                            />
                          </FormGroup>
                          <FormGroup>
                            <Label htmlFor="subject">Subject:</Label>
                            <ErrorMessage
                              name="subject"
                              component="span"
                              className="text-danger float-right"
                            ></ErrorMessage>
                            <Field
                              className="form-control"
                              name="subject"
                              type="text"
                              placeholder="Subject"
                            />
                          </FormGroup>
                          <FormGroup>
                            <Label htmlFor="blogTypeId">Category:</Label>
                            <ErrorMessage
                              name="blogTypeId"
                              component="span"
                              className="text-danger float-right"
                            ></ErrorMessage>
                            <Field
                              component="select"
                              className="form-control"
                              name="blogTypeId"
                            >
                              <option key="0-option" value="">
                                Select Blog Type
                              </option>
                              {this.state.blogTypes}
                            </Field>
                          </FormGroup>
                          <FormGroup>
                            <Label>Content: </Label>
                            <ErrorMessage
                              name="content"
                              component="span"
                              className="text-danger float-right"
                            ></ErrorMessage>
                            <CKEditor
                              content={values.content}
                              events={{
                                change: (event) =>
                                  setFieldValue(
                                    "content",
                                    event.editor.getData()
                                  ),
                              }}
                            />
                          </FormGroup>
                          <div className="upload-container">
                            {values.imageUrl && (
                              <img src={values.imageUrl} alt={"test"} />
                            )}

                            <input
                              onChange={(e) =>
                                this.handleUpload(e, setFieldValue)
                              }
                              className="file-input-btn"
                              type="file"
                            />
                          </div>
                          <div className="btn-showcase">
                            <button
                              className="btn btn-primary"
                              type="submit"
                              disabled={isSubmitting}
                            >
                              Post
                            </button>
                          </div>
                        </Col>
                      </Form>
                    )}
                  </Formik>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}
BlogPost.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape({
      id: PropTypes.number.isRequired,
      blogTypeId: PropTypes.number,
      authorId: PropTypes.number,
      title: PropTypes.string,
      subject: PropTypes.string,
      content: PropTypes.string,
      isPublished: PropTypes.bool,
      imageUrl: PropTypes.string,
      blogFile: PropTypes.string,
    }),
  }),
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
};
export default BlogPost;
