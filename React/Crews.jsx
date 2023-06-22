import React, { useEffect, useState, useCallback } from "react";
import { Card, Row, Table } from "react-bootstrap";
import PropTypes from "prop-types";
import debug from "sabio-debug";
import crewService from "services/crewService";
import CrewTableRow from "./CrewTableRow";
import { Col } from "reactstrap";
import Pagination from "rc-pagination";
import locale from "rc-pagination/lib/locale/en_US";
import "rc-pagination/assets/index.css";
import Swal from "sweetalert2";
import TitleHeader from "components/general/TitleHeader";

const _logger = debug.extend("Crews");

function Crews({ currentUser }) {
  const conferenceId = currentUser?.conferenceId;

  const [crewData, setCrewData] = useState({
    crewArray: [],
    crewComponents: [],
    conferenceId: conferenceId,
    current: 1,
    pageSize: 5,
    totalCount: 0,
    query: "",
    seasonId: 5,
  });

  useEffect(() => {
    if (crewData.query === "") {
      crewService
        .selectAll(crewData.current - 1, crewData.pageSize, crewData.seasonId)
        .then(onSelectAllSuccess)
        .catch(onSelectAllError);
    } else {
      crewService
        .search(crewData.current - 1, crewData.pageSize, crewData.query)
        .then(onSelectAllSuccess)
        .catch(onSelectAllError);
    }
  }, [crewData.current, crewData.pageSize, crewData.query]);

  const onSelectAllSuccess = (response) => {
    let paginatedData = response.item.pagedItems;
    _logger("selectAllSuccess", paginatedData);
    setCrewData((prevState) => {
      let pd = { ...prevState };
      pd.crewArray = paginatedData;

      pd.crewComponents = paginatedData.map(singleCrewMapper);
      pd.totalCount = response.item.totalCount;

      return pd;
    });
  };

  const onSelectAllError = (error) => {
    _logger("selectAllError", error);
  };

  const singleCrewMapper = (aCrew) => {
    return (
      <CrewTableRow
        crew={aCrew}
        key={aCrew.id}
        onDeleteCrewClicked={onDeleteCrewClicked}
      />
    );
  };

  const onPageChange = (page) => {
    _logger("THIS page", page);
    setCrewData((prevState) => {
      const pData = { ...prevState };
      pData.current = page;
      return pData;
    });
  };
  const handleChange = (e) => {
    e.preventDefault();
    setCrewData((prevState) => ({
      ...prevState,
      query: e.target.value,
      current: 1,
    }));
  };
  const onDeleteCrewClicked = useCallback((aCrew) => {
    Swal.fire({
      title: "Are you sure? This will delete the Team.",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#DD6B55",
      icon: "warning",
    }).then((result) => {
      if (result.isConfirmed) {
        crewService
          .delete(aCrew)
          .then(onDeleteCrewSuccess)
          .catch(onDeleteCrewFailure);
      }
    });
  }, []);

  const onDeleteCrewSuccess = (aCrew) => {
    Swal.fire("Team Delete Successful!");

    setCrewData((prevState) => {
      const cd = { ...prevState };
      cd.crewArray = [...cd.crewArray];

      const idxOf = prevState.crewArray.findIndex((item) => {
        let result = false;

        if (aCrew === item.id) {
          result = true;
        }
        return result;
      });

      if (idxOf >= 0) {
        _logger(idxOf);
        cd.crewArray.splice(idxOf, 1);
        cd.crewComponents = cd.crewArray.map(singleCrewMapper);
      }

      return cd;
    });
  };
  const onDeleteCrewFailure = (response) => {
    Swal.fire(
      "Unable to delete the selected team, please refresh and try again"
    );
    _logger({ error: response });
  };

  return (
    <React.Fragment>
      <TitleHeader
        title="Crews"
        buttonText="New Crew"
        buttonLink="/crews/new"
      />
      <Row>
        <Col>
          <Card lg={12} md={12} sm={12}>
            <div className="card-header">
              <Row>
                <Col>
                  <div className="d-flex col-5">
                    <input
                      id="searchCrew"
                      type="search"
                      className="form-control"
                      placeholder="Search Crews"
                      onChange={handleChange}
                      value={crewData.query}
                    />
                  </div>
                </Col>
              </Row>
            </div>
          </Card>
        </Col>
      </Row>
      <Card>
        <Table responsive hover className="table-white">
          <thead className="table-light">
            <tr className="bg-default">
              <th>Name</th>
              <th>Season</th>
              <th>Members</th>
              <th className="text-center px-2">Status</th>
              <th className="text-center px-2" colSpan={3}>
                Options
              </th>
            </tr>
          </thead>
          <tbody>{crewData.crewComponents}</tbody>
        </Table>
      </Card>

      <Pagination
        className="text-center mb-3 mt-2"
        locale={locale}
        current={crewData.current}
        total={crewData.totalCount}
        pageSize={crewData.pageSize}
        onChange={onPageChange}
      />
    </React.Fragment>
  );
}

Crews.propTypes = {
  currentUser: PropTypes.shape({
    conferenceId: PropTypes.number.isRequired,
  }).isRequired,
};

export default Crews;
