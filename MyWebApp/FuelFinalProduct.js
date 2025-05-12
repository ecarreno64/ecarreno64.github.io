// ============================
// FuelFinalProject.js (Fully Updated)
// ============================

const states = [
  'California', 'Texas', 'Florida', 'New York', 'Pennsylvania', 'Illinois',
  'Ohio', 'Georgia', 'North Carolina', 'Michigan', 'New Jersey', 'Virginia',
  'Washington', 'Arizona', 'Massachusetts', 'Tennessee', 'Indiana', 'Missouri',
  'Maryland', 'Wisconsin', 'Colorado', 'Minnesota', 'South Carolina', 'Alabama',
  'Louisiana', 'Kentucky', 'Oregon', 'Oklahoma', 'Connecticut', 'Iowa', 'Utah',
  'Nevada', 'Arkansas', 'Mississippi', 'Kansas', 'New Mexico', 'Nebraska',
  'West Virginia', 'Idaho', 'Hawaii', 'New Hampshire', 'Maine', 'Rhode Island',
  'Montana', 'Delaware', 'South Dakota', 'North Dakota', 'Alaska', 'Vermont',
  'Wyoming', 'District of Columbia'
];

const stateCodes = [
  'CA', 'TX', 'FL', 'NY', 'PA', 'IL', 'OH', 'GA', 'NC', 'MI', 'NJ', 'VA', 'WA', 'AZ', 'MA', 'TN', 'IN', 'MO', 'MD', 'WI',
  'CO', 'MN', 'SC', 'AL', 'LA', 'KY', 'OR', 'OK', 'CT', 'IA', 'UT', 'NV', 'AR', 'MS', 'KS', 'NM', 'NE', 'WV', 'ID', 'HI',
  'NH', 'ME', 'RI', 'MT', 'DE', 'SD', 'ND', 'AK', 'VT', 'WY', 'DC'
];

const expenditures = [
  57600, 46140, 31184, 25821, 24625, 20900, 20803, 20011, 19766, 16933,
  16821, 16554, 15899, 15432, 15045, 13987, 13763, 13450, 12987, 12744,
  12003, 11565, 11234, 11009, 10880, 10733, 10321, 10255, 9832, 9687,
  9432, 9021, 8980, 8867, 8774, 8355, 7998, 7770, 7550, 7432, 7211, 7088,
  6990, 6630, 6490, 6340, 5980, 5700, 5560, 5033
];

const breakdownPercentages = {
  crudeOil: 0.50,
  refining: 0.15,
  distribution: 0.10,
  taxes: 0.15,
  fuelCost: 0.10
};

function generateMapData(type) {
  const dataMap = {
    total: expenditures.map(e => e / 1000),
    crudeOil: expenditures.map(e => (e * breakdownPercentages.crudeOil) / 1000),
    refining: expenditures.map(e => (e * breakdownPercentages.refining) / 1000),
    distribution: expenditures.map(e => (e * breakdownPercentages.distribution) / 1000),
    taxes: expenditures.map(e => (e * breakdownPercentages.taxes) / 1000),
    fuelCost: expenditures.map(e => (e * breakdownPercentages.fuelCost) / 1000),
  };

  let colorscale;
  switch (type) {
    case 'crudeOil':
      colorscale = [[0, '#eeeeee'], [1, '#000000']];
      break;
    case 'refining':
      colorscale = [[0, '#fffde7'], [1, '#ffd700']];
      break;
    case 'distribution':
      colorscale = [[0, '#e0f7fa'], [1, '#00ced1']];
      break;
    case 'taxes':
      colorscale = [[0, '#e3f2fd'], [1, '#87cefa']];
      break;
    case 'fuelCost':
      colorscale = [[0, '#e8f5e9'], [1, '#228b22']];
      break;
    default:
      colorscale = [[0, '#fde0dd'], [0.5, '#fa8072'], [1, '#800000']];
  }

  return [{
    type: 'choropleth',
    locationmode: 'USA-states',
    locations: stateCodes,
    z: dataMap[type],
    text: states,
    hoverinfo: 'text',
    colorscale: colorscale,
    colorbar: {
      title: {
        text: `${type.charAt(0).toUpperCase() + type.slice(1)} Expenditure (Millions)`,
        side: 'right'
      },
      tickprefix: '$',
      ticksuffix: 'M',
      tickfont: { size: 14 },
      titlefont: { size: 16 },
      thickness: 20,
      len: 0.8,
      x: 1,
      xpad: 10
    }
  }];
}

const layout = {
  geo: {
    scope: 'usa',
    projection: { type: 'albers usa' },
    showlakes: true,
    lakecolor: '#ffffff',
    bgcolor: '#f7f7f7'
  },
  paper_bgcolor: '#f7f7f7',
  plot_bgcolor: '#f7f7f7'
};

function updateMapAndTitle() {
  const type = document.getElementById('expenditureType').value;
  const data = generateMapData(type);
  Plotly.react('map', data, layout);

  const mapTitle = {
    total: '2023 Motor Gasoline Total Expenditure by State',
    crudeOil: '2023 Crude Oil Expenditure by State',
    refining: '2023 Refining Expenditure by State',
    distribution: '2023 Distribution and Marketing Expenditure by State',
    taxes: '2023 Fuel Taxes Expenditure by State',
    fuelCost: '2023 Fuel Cost Expenditure by State'
  };
  document.getElementById('mapTitle').textContent = mapTitle[type] || mapTitle.total;

  document.getElementById('map').on('plotly_click', function (data) {
    if (data && data.points && data.points.length > 0) {
      const location = data.points[0].location;
      const i = stateCodes.indexOf(location);
      const total = expenditures[i];
      const state = states[i];
      const crude = total * breakdownPercentages.crudeOil;
      const refining = total * breakdownPercentages.refining;
      const dist = total * breakdownPercentages.distribution;
      const taxes = total * breakdownPercentages.taxes;
      const fuel = total * breakdownPercentages.fuelCost;

      document.getElementById('stateInfoBox').innerHTML = `
        <h4>${state}</h4>
        <ul>
          <li><strong>Total:</strong> $${(total / 1000).toLocaleString()}M</li>
          <li><strong>Crude Oil:</strong> $${(crude / 1000).toFixed(1)}M</li>
          <li><strong>Refining:</strong> $${(refining / 1000).toFixed(1)}M</li>
          <li><strong>Distribution:</strong> $${(dist / 1000).toFixed(1)}M</li>
          <li><strong>Taxes:</strong> $${(taxes / 1000).toFixed(1)}M</li>
          <li><strong>Fuel Cost:</strong> $${(fuel / 1000).toFixed(1)}M</li>
        </ul>
      `;
    }
  });
}

window.onload = function () {
  updateMapAndTitle();
};


