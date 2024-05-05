
import { useEffect, useMemo, useState } from "react"
import backend from "../utils/Backend"
import '@mantine/carousel/styles.css';
import { Carousel, CarouselSlide } from '@mantine/carousel';
import Datastream from "../Datastream/Datastream";

function Datashed() {
    const [datastreams, setDatastreams] = useState([])

    const updateDatastreams = async () => {
        const response = await backend.collection('datastreams').getFullList({
            sort: '+created',
            expand: 'actions',
            requestKey: null,
        });
        setDatastreams(response)
    }

    const subscribeToDatastreams = () => {
        backend.collection('datastreams').subscribe('*', function (e) {
            switch(e.action) {
                case 'create':
                    setDatastreams(prev => [...prev.filter(each => each.id !== e.record.id), e.record])
                    break;
                case 'update':
                    setDatastreams(prev => [...prev.map(each => {
                        if(each.id == e.record.id) {
                            return e.record
                        } else {
                            return each
                        }
                    })])
                    break;
                case 'delete':
                    setDatastreams(prev => [...prev.filter(each => each.id !== e.record.id), e.record])
            }
        }, {
            sort: '+created',
            expand: 'actions',
            requestKey: null,
        })
    }

    const unsubscribeFromDatastreams = () => {
        backend.collection('datastreams').unsubscribe('*');
    }

    useEffect(() => {
        updateDatastreams()
        subscribeToDatastreams()

        return () => {
            unsubscribeFromDatastreams()
        }
    }, [])

    const slides = useMemo(() => (
        datastreams.map((each) => (
            <CarouselSlide key={each.id}>
                <Datastream {...each}/>
            </CarouselSlide>
        ))
    ), [datastreams])

    return (
        <Carousel withIndicators height={`100vh`}>
            {slides}
        </Carousel>
    )
}

export default Datashed