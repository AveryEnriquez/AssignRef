import TitleHeader from "components/general/TitleHeader";

import React, { useState, useEffect } from "react";
import { Card, Col } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import debug from "sabio-debug";
import PropTypes from "prop-types";
import { Field, Formik, Form, ErrorMessage } from "formik";
import seasonBasicSchema from "schemas/seasonFormSchema";
import seasonService from "services/seasonService";
import Swal from "sweetalert2";

const _logger = debug.extend("seasonsForm");

function NewSeasonForm({ currentUser }) {
  const conferenceId = currentUser?.conferenceId;

  const navigate = useNavigate();

  const [seasonFormData, setSeasonFormData] = useState({
    name: "",
    year: "",
    conferenceId: conferenceId,

    weeks: "",
    id: "",
  });

  _logger("seasonFormData", seasonFormData);

  const { state } = useLocation();

  useEffect(() => {
    if (state?.type === "Season_Edit" && state.payload) {
      setSeasonFormData((prevState) => {
        const newSeasonFormData = { ...prevState };
        const season = state.payload;
        newSeasonFormData.name = season.name;
        newSeasonFormData.year = season.year;
        newSeasonFormData.weeks = season.weeks;
        newSeasonFormData.conferenceId = season.conference.id;
        newSeasonFormData.id = season.id;

        return newSeasonFormData;
      });
    }
  }, []);

  const onSubmitClicked = (values) => {
    _logger("submit clicked", values);
    if (state) {
      let id = values.id;
      let newPayload = values;

      seasonService
        .update(newPayload, id)
        .then(onUpdateSuccess)
        .catch(onUpdateError);
    } else {
      seasonService.add(values).then(onAddSuccess).catch(onAddError);
    }
  };
  const onUpdateSuccess = (response) => {
    Swal.fire("Season information has been successfully updated!");

    _logger("update response", response);
    navigate("/seasons");
  };

  const onUpdateError = (error) => {
    Swal.fire(
      "Season information not updated. Please make sure the form is filled out with correct information!"
    );
    _logger("update error", error);
  };

  const onAddSuccess = (response) => {
    Swal.fire(`You have successfully added a new season!`);
    _logger("season response", response);
    navigate("/seasons");
  };

  const onAddError = (error) => {
    _logger({ error });
  };

  _logger("state from season Form", state);

  return (
    <React.Fragment>
      <TitleHeader
        title="Season Form"
        buttonText="Back To Seasons"
        buttonLink="/seasons"
      />

      <Col lg={{ span: 8 }} md={12} sm={12}>
        <Formik
          enableReinitialize={true}
          initialValues={seasonFormData}
          validationSchema={seasonBasicSchema}
          onSubmit={onSubmitClicked}
        >
          <Form>
            <Card className="mb-3">
              <Card.Body>
                <div className=" form-group mb-3">
                  <label className="form-label" htmlFor="name">
                    Name
                  </label>

                  <Field
                    type="text"
                    placeholder="Season Name"
                    id="name"
                    name="name"
                    className="form-control"
                  />
                  <ErrorMessage name="name" component="div" className="" />
                </div>
                <div className=" form-group mb-3">
                  <label className="form-label" htmlFor="year">
                    Year
                  </label>
                  <Field
                    type="text"
                    placeholder="Season Year"
                    id="year"
                    name="year"
                    className="form-control"
                  />
                  <ErrorMessage name="year" component="div" className="" />
                </div>

                <div className=" form-group mb-3">
                  <label className="form-label" htmlFor="weeks">
                    Weeks
                  </label>
                  <Field
                    type="text"
                    placeholder="Season Weeks"
                    id="weeks"
                    name="weeks"
                    className="form-control"
                  />
                  <ErrorMessage name="weeks" component="div" className="" />
                </div>

                <div className="my-5">
                  <button className="btn btn-primary" type="submit">
                    Submit
                  </button>
                </div>
              </Card.Body>
            </Card>
          </Form>
        </Formik>
      </Col>
    </React.Fragment>
  );
}
NewSeasonForm.propTypes = {
  currentUser: PropTypes.shape({
    conferenceId: PropTypes.number.isRequired,
  }).isRequired,
};

export default NewSeasonForm;
