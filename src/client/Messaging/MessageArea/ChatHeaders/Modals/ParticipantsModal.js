import React from "react";
import PropTypes from "prop-types";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";

export default function SpringModal(props) {
  return (
    <>
      <Modal
        aria-labelledby="spring-modal-title"
        aria-describedby="spring-modal-description"
        open={props.open}
        onClose={props.closeModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <div className="participants-modal">
          <List component="nav" aria-label="mailbox folders">
            {Object.keys(props.participants).map((participant) => {
              return (
                <div key={participant}>
                  <ListItem button>
                    <ListItemText>
                      {props.participants[participant].name}
                    </ListItemText>
                  </ListItem>
                  <Divider />
                </div>
              );
            })}
          </List>
        </div>
      </Modal>
    </>
  );
}
