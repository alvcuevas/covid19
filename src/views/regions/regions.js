import React, { useState, useEffect } from 'react';
import { fetchRegions, fetchRegion } from '../../api';
import { ResponsiveBar } from '@nivo/bar';
import Spinner from '../../components/spinner';
import { Select } from 'antd';

import './regions.scss';
const { Option } = Select;

const RegionsView = () => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [regions, setRegions] = useState([]);
    const [selectedRegion, setSelectedRegion] = useState('10');

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const res = await fetchRegions();
                const { regions } = res;

                let regionsArr = [];
                Object.values(regions).forEach(reg => regionsArr.push(reg));
                setRegions(regionsArr);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchOptions();
    }, []);

    useEffect(() => {
        const fetchRegionData = async region => {
            setLoading(true);
            try {
                const res = await fetchRegion(region);
                setData(res);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchRegionData(selectedRegion);
    }, [selectedRegion]);

    const renderRegions = () => (
        <div className='region-selector'>
            <Select
                defaultValue='C. Valenciana'
                style={{ width: 200 }}
                onChange={value => setSelectedRegion(value)}>
                {regions.map(region => (
                    <Option key={region.code} value={region.code}>
                        {region.name}
                    </Option>
                ))}
            </Select>
        </div>
    );

    const renderSpinner = () => (
        <div className='loader'>
            <Spinner color={'#E8C1A0'} />
        </div>
    );

    const renderGraph = () => {
        const { confirmed, recovered, deaths, hospitalized, uci } = data;
        const barsData = [
            {
                status: 'Confirmados',
                totales: confirmed.value,
                totalesColor: 'hsl(175, 70%, 50%)',
                estimados: confirmed.estimateTomorrow,
                estimadosColor: 'hsl(172, 70%, 50%)'
            },
            {
                status: 'Recuperados',
                totales: recovered.value,
                totalesColor: 'hsl(175, 70%, 50%)',
                estimados: recovered.estimateTomorrow,
                estimadosColor: 'hsl(32, 70%, 50%)'
            },
            {
                status: 'Muertos',
                totales: deaths.value,
                totalesColor: 'hsl(175, 70%, 50%)',
                estimados: deaths.estimateTomorrow,
                estimadosColor: 'hsl(323, 70%, 50%)'
            },
            {
                status: 'Hospitalizados',
                totales: hospitalized.value,
                totalesColor: 'hsl(175, 70%, 50%)',
                estimados: hospitalized.estimateTomorrow,
                estimadosColor: 'hsl(273, 70%, 50%)'
            },
            {
                status: 'UCI',
                totales: uci.value,
                totalesColor: 'hsl(175, 70%, 50%)',
                estimados: uci.estimateTomorrow,
                estimadosColor: 'hsl(73, 70%, 50%)'
            }
        ];
        return (
            <div className='regions-graph'>
                <ResponsiveBar
                    data={barsData}
                    keys={['totales', 'estimados']}
                    indexBy='status'
                    margin={{ top: 25, right: 130, bottom: 100, left: 60 }}
                    padding={0.25}
                    groupMode='grouped'
                    colors={{ scheme: 'set3' }}
                    defs={[
                        {
                            id: 'dots',
                            type: 'patternDots',
                            background: '#97e3d5',
                            color: '#61cdbb',
                            size: 4,
                            padding: 1,
                            stagger: true
                        },
                        {
                            id: 'lines',
                            type: 'patternLines',
                            background: 'inherit',
                            color: '#97e3d5',
                            rotation: -45,
                            lineWidth: 1,
                            spacing: 10
                        }
                    ]}
                    fill={[
                        {
                            match: {
                                id: 'estimados'
                            },
                            id: 'dots'
                        }
                    ]}
                    borderColor={{
                        from: 'color',
                        modifiers: [['darker', '1.6']]
                    }}
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legendPosition: 'middle',
                        legendOffset: 32
                    }}
                    axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legendPosition: 'middle',
                        legendOffset: -40
                    }}
                    enableLabel={false}
                    labelSkipWidth={12}
                    labelSkipHeight={36}
                    labelTextColor={{
                        from: 'color',
                        modifiers: [['darker', 1.6]]
                    }}
                    legends={[
                        {
                            dataFrom: 'keys',
                            anchor: 'bottom',
                            direction: 'row',
                            justify: false,
                            translateX: -19,
                            translateY: 90,
                            itemsSpacing: 4,
                            itemWidth: 82,
                            itemHeight: 55,
                            itemDirection: 'left-to-right',
                            itemOpacity: 0.85,
                            symbolSize: 19,
                            effects: [
                                {
                                    on: 'hover',
                                    style: {
                                        itemOpacity: 1
                                    }
                                }
                            ]
                        }
                    ]}
                    animate={true}
                    motionStiffness={90}
                    motionDamping={15}
                />
            </div>
        );
    };

    return (
        <>
            <div className='regions'>
                {renderRegions()}
                {loading && renderSpinner()}
                {!loading && data && renderGraph()}
                {error && 'Error al obtener los datos'}
            </div>
        </>
    );
};

export default RegionsView;
