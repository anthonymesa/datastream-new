import { Button, Card, Group, Menu, MenuDivider, MenuDropdown, MenuItem, MenuLabel, MenuTarget, Modal, Stack, Text } from '@mantine/core';
import ActionsList from '../ActionsList/ActionsList';
import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import backend from '../utils/Backend';

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
        
        <Modal opened={openedNewDatastream} onClose={closeNewDatastream} title="Authentication">

        </Modal>

        <Modal opened={openedNewAction} onClose={closeNewAction} title="Authentication">
            
        </Modal>
        
        </>
    )
}

export default Datastream