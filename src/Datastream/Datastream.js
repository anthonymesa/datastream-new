import { Button, Card, Group, Menu, MenuDivider, MenuDropdown, MenuItem, MenuLabel, MenuTarget, Modal, Select, Stack, Text, TextInput } from '@mantine/core';
import ActionsList from '../ActionsList/ActionsList';
import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import backend from '../utils/Backend';

function NewDatastreamModal({id, close}) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')

    const handleTitleChange = (e) => {
        setTitle(e.currentTarget.value)
    }

    const handleDescriptionChange = (e) => {
        setDescription(e.currentTarget.value)
    }

    const handleSubmit = () => {
        const data = {
            "owner": backend.authStore.model.id,
            "title": title,
            "description": description,
            "actions": []
        };

        backend.collection('datastreams').create(data).then(() => {
            close()
        })
    }

    return (
        <Stack>
            <TextInput label="Title" placeholder="e.g. Shopping List" value={title} onChange={handleTitleChange}/>
            <TextInput label="description" value={description} onChange={handleDescriptionChange} />
            <Button onClick={handleSubmit}>Submit</Button>
        </Stack>
    )
}

function NewActionModal({id, actions, close}) {
    const actionStatesList = ['paused', 'incomplete', 'complete']
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [actionState, setActionState] = useState(actionStatesList[0]);
    
    const handleTitleChange = (e) => {
        setTitle(e.currentTarget.value)
    }

    const handleDescriptionChange = (e) => {
        setDescription(e.currentTarget.value)
    }

    const handleSubmit = () => {
        const data = {
            "owner": backend.authStore.model.id,
            "title": title,
            "description": description,
            "clone": false,
            "cloneRef": '',
            "state": actionState,
            "actions": []
        };

        backend.collection('actions').create(data).then((res) => {
            backend.collection('datastreams').update(id, { actions: [...actions, res.id] })
            close()
        })
    }
    return (
        <Stack>
            <TextInput label="Title" placeholder="e.g. Pick up groceries" value={title} onChange={handleTitleChange}/>
            <TextInput label="description" value={description} onChange={handleDescriptionChange} />
            <Select data={actionStatesList} value={actionState} onChange={setActionState} ></Select>
            <Button onClick={handleSubmit}>Submit</Button>
        </Stack>
    )
}

function Datastream(datastream) {
    const { id, title, description } = datastream
    const actions = datastream?.expand?.actions ?? []
    const [openedNewDatastream, { open: openNewDatastream, close: closeNewDatastream}] = useDisclosure(false);
    const [openedNewAction, { open: openNewAction, close: closeNewAction}] = useDisclosure(false);

    const handleLogOut = () => {
        backend.authStore.clear()
    }

    return (
        <>
            <Stack>
                <Group justify='space-between'>
                    <Text>{title}</Text>
                    <Menu shadow="md" width={200}>
                        <MenuTarget>
                            <Button>:</Button>
                        </MenuTarget>

                        <MenuDropdown>
                            <MenuLabel>New</MenuLabel>

                            <MenuItem onClick={openNewDatastream}>Datastream</MenuItem>
                            <MenuItem onClick={openNewAction}>Action</MenuItem>
                            <MenuDivider />
                            <MenuItem onClick={handleLogOut}>Log Out</MenuItem>
                        </MenuDropdown>
                    </Menu>
                </Group>
                <Card>
                    <Text>{description}</Text>
                </Card>
                <ActionsList actions={actions}/>
            </Stack>
            
            <Modal opened={openedNewDatastream} onClose={closeNewDatastream} title="Create Datastream">
                <NewDatastreamModal id={id} close={closeNewDatastream} />
            </Modal>

            <Modal opened={openedNewAction} onClose={closeNewAction} title="Create Action">
                <NewActionModal id={id} actions={datastream.actions} close={closeNewAction}/>
            </Modal>
        </>
    )
}

export default Datastream