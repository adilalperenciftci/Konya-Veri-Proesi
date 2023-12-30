import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, Popup, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Container, Row, Col, Form } from 'react-bootstrap';
import './MapComponent.css';
import Papa from 'papaparse';
import 'bootstrap-icons/font/bootstrap-icons.css';

const UserLocationMarker = () => {
    const [position, setPosition] = useState(null);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            setPosition([position.coords.latitude, position.coords.longitude]);
        });
    }, []);

    const customIcon = L.divIcon({
        className: 'my-custom-pin',
        html: `<span class="bi bi-geo-alt-fill" style="font-size: 3rem; color: red;"></span>`,
        iconSize: [40, 50],
        iconAnchor: [20, 50]
    });

    return position === null ? null : (
        <Marker position={position} icon={customIcon}>
            <Popup>Şu anki konumunuz</Popup>
        </Marker>
    );
};

const MapComponent = () => {
    const [geoJsonData, setGeoJsonData] = useState([]);
    const [selectedLayer, setSelectedLayer] = useState('');
    const [csvData, setCsvData] = useState([]);

    const geoJsonFiles = [
        { name: 'Eczaneler', file: '1_202103_eczaneler.geojson' },
        { name: 'Acil Sağlık Hizmetleri İstasyonları', file: 'acil-saglik-hizmetleri-istasyonlari.geojson' },
        { name: 'Aile Sağlığı Merkezleri', file: 'aile-sagligi-merkezleri.geojson' },
        { name: 'Hastaneler', file: 'hastaneler.geojson' },
        { name: 'Sağlık Tesisleri', file: 'salk-tesisleri.geojson' },
        { name: 'Toplum Sağlığı Merkezleri', file: 'toplum-sagligi-merkezleri.geojson' }
    ];

    const csvFiles = [
        '/assets/csv/eczaneler.csv',
        '/assets/csv/evde-bakim-hizmetleri.csv',
        '/assets/csv/salk-tesisleri.csv'
    ];

    useEffect(() => {
        Promise.all(geoJsonFiles.map(item =>
            fetch(`/assets/geojson/${item.file}`).then(response => response.json())
                .then(data => ({ name: item.name, data: data }))
        )).then(data => {
            setGeoJsonData(data);
        });

        csvFiles.forEach(file => {
            Papa.parse(file, {
                download: true,
                header: true,
                complete: (result) => {
                    setCsvData(currentData => [...currentData, ...result.data]);
                }
            });
        });
    }, []);

    const handleLayerChange = (event) => {
        setSelectedLayer(event.target.value);
    };

    return (
        <Container fluid>
            <Row>
                <Col>
                    <Form>
                        <Form.Group>
                            <Form.Label>Veri Katmanı Seçin</Form.Label>
                            <Form.Control as="select" onChange={handleLayerChange}>
                                <option value="">Tüm Katmanlar</option>
                                {geoJsonFiles.map((item, index) => (
                                    <option key={index} value={item.name}>{item.name}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </Col>
            </Row>
            <Row>
                <Col>
                    <MapContainer center={[39.9334, 32.8597]} zoom={6} style={{ height: '600px', width: '100%' }}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <UserLocationMarker />
                        {geoJsonData.map((item, index) => {
                            if (item.name === selectedLayer || selectedLayer === '') {
                                return (
                                    <GeoJSON key={index} data={item.data}>
                                        <Popup>
                                            <span>{item.name}</span>
                                        </Popup>
                                    </GeoJSON>
                                );
                            }
                            return null;
                        })}
                    </MapContainer>
                </Col>
            </Row>
        </Container>
    );
};

export default MapComponent;
