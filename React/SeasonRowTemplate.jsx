import React from "react";
import debug from "sabio-debug";
import PropTypes from "prop-types";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { FaUserEdit } from "react-icons/fa";
import { BsTrash3 } from "react-icons/bs";
import { SlOptionsVertical } from "react-icons/sl";
import { useNavigate } from "react-router-dom";
import { Form } from "react-bootstrap";
import { useState } from "react";
import seasonService from "services/seasonService";

const _logger = debug.extend("Season Row Template");

function SeasonRowTemplate(props) {
  _logger("props from seasons row", props);

  const navigate = useNavigate();

  const [showDropdown, setShowDropdown] = useState(false);

  const [isSeasonActive, setIsSeasonActive] = useState(
    props?.season?.statusType?.id === 1
  );

  const onDeleteIconClicked = (evt) => {
    evt.preventDefault();
    props.onDeleteSeasonClicked(props?.season?.id);
    _logger("delete clicked");
  };

  const onEditClicked = () => {
    _logger("local edit clicked");
    navigate(`/seasons/new/?id=${props?.season?.id}`, {
      state: { type: "Season_Edit", payload: props.season },
    });
  };

  const toggleModal = () => {
    setShowDropdown(!showDropdown);
  };

  const onSeasonStatusChange = () => {
    const newStatus = isSeasonActive ? 2 : 1;
    seasonService
      .statusUpdate(props.season.id, newStatus)
      .then(onStatusUpdateSuccess);
  };

  const onStatusUpdateSuccess = () => {
    setIsSeasonActive(!isSeasonActive);
  };

  return (
    <React.Fragment>
      <tr role="row" className="background-color: white">
        <td role="cell" className="align-middle">
          <h5>{props?.season?.name}</h5>
        </td>
        <td role="cell" className="align-middle">
          <div className="d-flex align-items-center">
            <img
              src={props?.season?.conference?.code}
              alt="https://shorturl.at/jpEKM"
              style={{ objectFit: "contain" }}
              className="avatar-md me-3 object-fit:contain"
            />
          </div>
        </td>
        <td role="cell" className="align-middle">
          <h5>{props?.season?.weeks}</h5>
        </td>
        <td role="cell" className="align-middle">
          <h5>{props?.season?.year}</h5>
        </td>
        <td className="text-center">
          <span className="me-1">
            <span>
              <Form.Check
                type="switch"
                checked={isSeasonActive}
                onChange={onSeasonStatusChange}
              />
            </span>
          </span>
        </td>
        <td className="text-center">
          <Dropdown isOpen={showDropdown} toggle={toggleModal}>
            <DropdownToggle aria-expanded data-toggle="dropdown" tag="span">
              <SlOptionsVertical title="More Options" />
            </DropdownToggle>
            <DropdownMenu className="opacity-100">
              <DropdownItem onClick={onEditClicked}>
                <FaUserEdit title="Edit" className="text-warning" /> Edit
              </DropdownItem>
              {isSeasonActive && (
                <DropdownItem onClick={onDeleteIconClicked}>
                  <BsTrash3 title="Delete" className="text-danger" /> Delete
                </DropdownItem>
              )}
            </DropdownMenu>
          </Dropdown>
        </td>
      </tr>
    </React.Fragment>
  );
}

SeasonRowTemplate.propTypes = {
  onDeleteSeasonClicked: PropTypes.func,
  onEditSeasonisActive: PropTypes.func,
  season: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    statusType: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
    year: PropTypes.number.isRequired,
    weeks: PropTypes.number.isRequired,
    conference: PropTypes.shape({
      code: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
      logo: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  }),
};

export default SeasonRowTemplate;
