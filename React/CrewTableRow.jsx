import React from "react";
import debug from "sabio-debug";
import PropTypes from "prop-types";
import { FaUserEdit } from "react-icons/fa";
import { BsTrash3 } from "react-icons/bs";
import { SlOptionsVertical } from "react-icons/sl";
import { useNavigate } from "react-router-dom";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
} from "reactstrap";
const _logger = debug.extend("Crews Table Temaplate");

function CrewRowTemplate(props) {
  _logger("props from CrewRowTemplate", props);
  const [showDropdown, setShowDropdown] = React.useState(false);

  _logger("props from crewRowTemplate ", props);

  const navigate = useNavigate();

  const isActive = props?.crew?.statusType.id === 1;

  const onDeleteIconClicked = (evt) => {
    evt.preventDefault();
    props.onDeleteCrewClicked(props.crew.id);
    _logger("delete clicked");
  };

  const onEditClicked = () => {
    _logger("local edit clicked");
    navigate(`/crews/new/?id=${props?.crew?.id}`, {
      state: { type: "Crew_Edit", payload: props.crew },
    });
  };

  const toggleModal = () => {
    setShowDropdown(!showDropdown);
  };

  const mapCrewMembers = (aCrewMember, index) => {
    return (
      <p className="avatar avatar-sm me-1 mb-0" key={index}>
        <img
          src={aCrewMember.user.avatarUrl}
          alt="pic"
          className="mb-2 mb-lg-0 rounded-circle"
        />
      </p>
    );
  };
  const mapOtherCrewMembers = (aCrewMember, index) => {
    return (
      <DropdownItem key={index}>
        <div className="avatar avatar-sm me-0">
          <img
            src={aCrewMember.user.avatarUrl}
            alt="pic"
            className="mb-2 mb-lg-0 rounded-circle"
          />
          <div>
            {aCrewMember.user.firstName} {aCrewMember.user.lastName}
          </div>
        </div>
      </DropdownItem>
    );
  };

  const mapReferee = (aRef, index) => {
    return (
      aRef?.position?.name === "Referee" && (
        <img
          key={index}
          src={aRef?.user?.avatarUrl}
          alt="pic"
          className="rounded-circle border border-white me-3"
          style={{ height: "2.2rem", width: "2.2rem" }}
        />
      )
    );
  };
  const initialCrewMembers = props.crew.members
    ?.slice(0, 4)
    .map(mapCrewMembers);

  const refereeImage = props?.crew?.members?.map(mapReferee);

  const otherCrewMembers = props.crew.members
    ?.slice(4)
    .map(mapOtherCrewMembers);
  _logger("referee", refereeImage);
  return (
    <React.Fragment>
      <tr role="row" className="background-color: white">
        <td>
          {refereeImage ? (
            refereeImage
          ) : (
            <img
              src="https://media.istockphoto.com/id/959942788/vector/abstract-in-blue-football-referee-with-red-card-and-ball-soccer-referee-isolated-on-a-white.jpg?s=612x612&w=0&k=20&c=C1khk5rH0NVAybnY_qoS9jBuIUSiyTpLJyGQqt570-Q="
              alt="pic"
              className="avatar avatar-md avatar-primary me-0 mb-2 mb-lg-0 "
            />
          )}
          <span className="fw-bold">{props?.crew?.name}</span>
        </td>
        <td role="cell" className="align-middle">
          <h5>{props?.crew?.season?.name}</h5>
        </td>
        <td role="cell" className=" align-middle text-nowrap">
          <div className="avatar-group">
            {initialCrewMembers}
            {props?.crew?.members?.length > 4 ? (
              <span className="avatar avatar-md avatar-primary me-0 mb-2 mb-lg-0 ">
                <UncontrolledDropdown>
                  <DropdownToggle className="rounded-circle avatar-sm mb-2 mb-lg-0 p-0">
                    +
                  </DropdownToggle>
                  <DropdownMenu>{otherCrewMembers}</DropdownMenu>
                </UncontrolledDropdown>
              </span>
            ) : null}
          </div>
        </td>
        <td className="text-center">
          <span className="me-1">
            <span
              className={`badge-dot badge ${
                isActive ? "bg-success" : "bg-danger"
              }`}
            ></span>
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
              {isActive && (
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

export default React.memo(CrewRowTemplate);

CrewRowTemplate.propTypes = {
  onDeleteCrewClicked: PropTypes.func,
  crew: PropTypes.shape({
    name: PropTypes.string.isRequired,
    crewId: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
    season: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
    fieldPosition: PropTypes.shape({
      code: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
    statusType: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
    creator: PropTypes.shape({
      id: PropTypes.number.isRequired,
      avatarUrl: PropTypes.string.isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      mi: PropTypes.string,
    }).isRequired,
    id: PropTypes.number,
    members: PropTypes.arrayOf(
      PropTypes.shape({
        gender: PropTypes.string.isRequired,
        id: PropTypes.number.isRequired,
        position: PropTypes.shape({
          code: PropTypes.string.isRequired,
          id: PropTypes.number.isRequired,
          name: PropTypes.string.isRequired,
        }).isRequired,
        user: PropTypes.shape({
          avatarUrl: PropTypes.string.isRequired,
          firstName: PropTypes.string.isRequired,
          lastName: PropTypes.string.isRequired,
        }).isRequired,
      }).isRequired
    ),
  }).isRequired,
};
