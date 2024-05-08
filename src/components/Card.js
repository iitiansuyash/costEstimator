import "../styles/card.css"
import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';

const Card = ({ cardId, title, options, handleOptionSelect }) => {
    const [selectedOption, setSelectedOption] = useState('');
    const [customValue, setCustomValue] = useState('');

    const handleChange = (e) => {
        const { value } = e.target;
        setSelectedOption(value);
        handleOptionSelect(cardId, value === 'Custom' ? customValue : value);
    };

    const handleCustomInputChange = (e) => {
        const { value } = e.target;
        setCustomValue(value);
        handleOptionSelect(cardId, value);
    };
    return (
        <div className="card">
            <h2>{title}</h2>
            <select onChange={handleChange} value={selectedOption}>
                {options.map(option => (
                    <option key={option.id} value={option.text}>
                        {option.text}
                    </option>
                ))}
            </select>
            {selectedOption === 'Custom' && (
                <input
                    type="text"
                    value={customValue}
                    onChange={handleCustomInputChange}
                    placeholder="Enter custom value"
                />
            )}
        </div>
    );
}

const CardContainer = () => {
    const [cards, setCards] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [totalCost, setTotalCost] = useState(0);
    const [customData, setCustomData] = useState(0);

    useEffect(() => {
        fetch('http://localhost:3001/cards')
            .then(response => response.json())
            .then(data => setCards(data));
    }, []);

    const handleOptionSelect = (cardId, cost) => {
        setSelectedOptions(prevState => ({
            ...prevState,
            [cardId]: parseInt(cost)
        }));
    }

    useEffect(() => {
        let sum = 0;
        for (let cardId in selectedOptions) {
            sum += selectedOptions[cardId];
        }
        setTotalCost(sum);
    }, [selectedOptions]);

    const calculateTotalCost = (cardId) => {
        return selectedOptions[cardId] || cards.find(card => card.id === cardId)?.options[0]?.cost || 0;
    }
    
    const chartData = cards.map(card => ({
        title: card.title,
        cost: selectedOptions[card.id] || card.options[0]?.cost || 0
    }));
    

    const options = {
        labels: chartData.map(data => data.title),
        series: chartData.map(data => data.cost),
        colors: ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0']
    };

    return (
        <div>
            <div className="chart">
                <Chart options={options} series={options.series} type="pie" width="380" />
            </div>
            <div className="total-cost">
                <p>Total Estimated Cost: ${totalCost}</p>
            </div>
            <div className="total">
                <p>Total: ${totalCost}</p>
            </div>
            <div className="card-container">
                {cards.map((card, index) => (
                    <React.Fragment key={card.id}>
                        <Card key={card.id} cardId={card.id} title={card.title} options={card.options} handleOptionSelect={handleOptionSelect} />
                        {index !== cards.length  && <div className="line" />}
                        {index !== cards.length - 1 && <div className="plus">+</div>}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}

export default CardContainer;
