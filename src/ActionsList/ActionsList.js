import {
  Accordion,
  AccordionControl,
  AccordionItem,
  AccordionPanel,
  Button,
  Card,
  Center,
  Group,
  Modal,
} from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import backend from "../utils/Backend";
import NewActionModal from "../NewActionModal/NewActionModal";
import { useDisclosure } from "@mantine/hooks";

function Action(action) {
  const [subActions, setSubActions] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [actions, setActions] = useState([]);

  const [openedNewAction, { open: openNewAction, close: closeNewAction }] =
    useDisclosure(false);
  const updateAction = (action) => {
    setTitle(action.title);
    setDescription(action.description);
    setActions(action.actions);
    setSubActions(action?.expand?.actions ?? []);
  };

  const updateSubActions = async () => {
    const response = await backend
      .collection("actions")
      .getOne(`${action.id}`, {
        sort: "+created",
        expand: "actions",
        requestKey: null,
      });
    updateAction(response);
  };

  const subscribeToAction = () => {
    backend.collection("actions").subscribe(
      `${action.id}`,
      function (e) {
        updateAction(e.record);
      },
      {
        sort: "+created",
        expand: "actions",
        requestKey: null,
      }
    );
  };

  const unsubscribeFromAction = () => {
    backend.collection("actions").unsubscribe(`${action.id}`);
  };

  useEffect(() => {
    updateSubActions();
    subscribeToAction();

    return () => {
      unsubscribeFromAction();
    };
  }, []);

  const recursivelyDelete = (actions) => {
    actions.forEach((each) => {
      backend
        .collection("actions")
        .getOne(each.id, {
          sort: "+created",
          expand: "actions",
          requestKey: null,
        })
        .then((action) => {
          const subActions = action?.expand?.actions ?? [];
          if (subActions.length > 0) {
            recursivelyDelete(subActions);
          }
          backend.collection("actions").delete(action.id);
        });
    });
  };

  const handleDeleteAction = () => {
    recursivelyDelete(subActions);
    backend.collection("actions").delete(action.id);
  };

  return (
    <>
      <AccordionItem key={action.id} value={action.id}>
        <AccordionControl>{title}</AccordionControl>
        <AccordionPanel>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            {description}
          </Card>
          <ActionsList actions={subActions} />
          <Center>
            <Group>
              <Button onClick={openNewAction}>Add</Button>
              <Button>Edit</Button>
              <Button>Clone</Button>
              <Button onClick={handleDeleteAction}>Delete</Button>
            </Group>
          </Center>
        </AccordionPanel>
      </AccordionItem>

      <Modal
        opened={openedNewAction}
        onClose={closeNewAction}
        title="Create Action"
      >
        <NewActionModal
          id={action.id}
          actions={actions}
          isRoot={false}
          close={closeNewAction}
        />
      </Modal>
    </>
  );
}

function ActionsList({ actions }) {
  const list = useMemo(
    () => actions.map((each) => <Action key={each.id} {...each} />),
    [actions]
  );

  return <Accordion>{list}</Accordion>;
}

export default ActionsList;
