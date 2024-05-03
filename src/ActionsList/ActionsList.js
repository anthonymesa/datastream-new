import { Accordion, AccordionControl, AccordionItem, AccordionPanel, Card, Center } from '@mantine/core';
import { useEffect, useMemo, useState } from 'react';
import backend from '../utils/Backend';

function Action(action) {

    const [subActions, setSubActions] = useState([])
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const updateAction = (action) => {
        setTitle(action.title);
        setDescription(action.description);
        setSubActions(action?.expand?.actions ?? [])
    }
    const updateSubActions = async () => {
        const response = await backend.collection('actions').getOne(`${action.id}`,{
            sort: '+created',
            expand: 'actions',
            requestKey: null,
        });
        updateAction(response)
    }

    const subscribeToAction = () => {
        backend.collection('actions').subscribe(`${action.id}`, function (e) {
            updateAction(e.record);
        }, {
            sort: '+created',
            expand: 'actions',
            requestKey: null,
        })
    }

    const unsubscribeFromAction = () => {
        backend.collection('actions').unsubscribe(`${action.id}`);
    }

    useEffect(() => {
        updateSubActions()
        subscribeToAction()

        return () => {
            unsubscribeFromAction()
        }
    }, [])

    return (
        <AccordionItem key={action.id} value={action.id}>
            <AccordionControl>{title}</AccordionControl>
            <AccordionPanel>
                {description}
                <ActionsList actions={subActions}/>
            </AccordionPanel>
        </AccordionItem>
    )
}

function ActionsList({actions}) {
    const list = useMemo(() => (
        actions.map((each) => (
            <Action key={each.id} {...each} />
        ))
    ), [actions])

    return (
        <Accordion>
            {list}
        </Accordion>
    )
}

export default ActionsList