import { Card, Stack, Text } from '@mantine/core';
import ActionsList from '../ActionsList/ActionsList';

function Datastream(datastream) {
    const { id, title, description } = datastream
    const actions = datastream?.expand?.actions ?? []

    return (
        <Stack>
            <Text>{title}</Text>
            <Card>
                <Text>{description}</Text>
            </Card>
            <ActionsList actions={actions}/>
        </Stack>
    )
}

export default Datastream