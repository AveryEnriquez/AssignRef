import React, { useCallback, useEffect, useState } from "react";
import { Card, Table } from "react-bootstrap";
import PropTypes from "prop-types";
import debug from "sabio-debug";
import seasonService from "services/seasonService";
import SeasonRowTemplate from "./SeasonRowTemplate";
import TitleHeader from "components/general/TitleHeader";
import Swal from "sweetalert2";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import locale from "rc-pagination/lib/locale/en_US";

const _logger = debug.extend("Seasons");

function Seasons({ currentUser }) {
  const conferenceId = currentUser?.conferenceId;

  const [seasonsData, setSeasonData] = useState({
    seasonsArray: [],
    seasonsComponents: [],
    conferenceId: conferenceId,
    current: 1,
    totalCount: 0,
    pageSize: 10,
  });

  const isAdmin = currentUser.roles.some((role) => role === "Admin");

  _logger("current user", currentUser, isAdmin);

  useEffect(() => {
    seasonService
      .GetByConferencePaginate(
        seasonsData.current - 1,
        seasonsData.pageSize,
        seasonsData.conferenceId
      )
      .then(onSeasonGetSuccess)
      .catch(onSeasonGetError);
  }, [seasonsData.current, seasonsData.pageSize, seasonsData.conferenceId]);

  const onSeasonGetSuccess = (response) => {
    let seasonData = response.item.pagedItems;
    setSeasonData((prevState) => {
      let sd = { ...prevState };
      sd.seasonsArray = seasonData;
      sd.seasonsComponents = seasonData.map(mapSeasons);
      sd.totalCount = response.item.totalCount;
      return sd;
    });
  };
  _logger("logger after success ", seasonsData);
  const onDeleteSeasonClicked = useCallback((aSeason) => {
    Swal.fire({
      title: "Are you sure? This will delete the Team.",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#DD6B55",
      icon: "warning",
    }).then((result) => {
      if (result.isConfirmed) {
        seasonService
          .delete(aSeason)
          .then(onDeleteSeasonSuccess)
          .catch(onDeleteCrewFailure);
      }
    });
  }, []);

  const mapSeasons = (aSeason) => {
    return (
      <SeasonRowTemplate
        season={aSeason}
        key={aSeason.id}
        onDeleteSeasonClicked={onDeleteSeasonClicked}
      />
    );
  };

  const onDeleteSeasonSuccess = (aSeason) => {
    Swal.fire("Season Delete Successful!");

    setSeasonData((prevState) => {
      const sd = { ...prevState };
      sd.seasonsArray = [...sd.seasonsArray];

      const idxOf = prevState.seasonsArray.findIndex((item) => {
        let result = false;

        if (aSeason === item.id) {
          result = true;
        }
        return result;
      });

      if (idxOf >= 0) {
        _logger(idxOf);
        sd.seasonsArray.splice(idxOf, 1);
        sd.seasonsComponents = sd.seasonsArray.map(mapSeasons);
      }

      return sd;
    });
  };
  const onDeleteCrewFailure = (response) => {
    Swal.fire(
      "Unable to delete the selected team, please refresh and try again"
    );
    _logger({ error: response });
  };

  const onSeasonGetError = (error) => {
    _logger({ error });
  };

  const onPageChange = (page) => {
    setSeasonData((prevState) => {
      const pData = { ...prevState };
      pData.current = page;
      return pData;
    });
  };

  return (
    <React.Fragment>
      <TitleHeader
        title="Seasons"
        buttonText="New Season"
        buttonLink="/seasons/new"
      />

      <Card>
        <Table responsive hover className="table-white">
          <thead className="table-light">
            <tr className="bg-default">
              <th>Name</th>
              <th>Conference</th>
              <th>Weeks</th>
              <th>Year</th>
              <th className="text-center px-2">Status</th>
              <th className="text-center px-2" colSpan={3}>
                Options
              </th>
            </tr>
          </thead>
          <tbody>{seasonsData.seasonsComponents}</tbody>
        </Table>
      </Card>
      <Pagination
        className="text-center mb-3 mt-2"
        locale={locale}
        current={seasonsData.current}
        total={seasonsData.totalCount}
        pageSize={seasonsData.pageSize}
        onChange={onPageChange}
      />
    </React.Fragment>
  );
}
Seasons.propTypes = {
  currentUser: PropTypes.shape({
    roles: PropTypes.arrayOf(PropTypes.string).isRequired,
    conferenceId: PropTypes.number.isRequired,
  }).isRequired,
  isAdmin: PropTypes.bool,
  some: PropTypes.func,
};
export default Seasons;
