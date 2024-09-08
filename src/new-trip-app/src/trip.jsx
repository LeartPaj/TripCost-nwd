import React, { useEffect, useState } from 'react';
import { Box, Stack, Paper, TextField, Button, Container, Typography, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material';
import axios from 'axios';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const TripCalculator = () => {
  
  //CAR USESTATEHOOK VARIABLES
  const [years, setYears] = useState([]);
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [options, setOptions] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [carId, setCarId] = useState('');
  const [carMpg, setCarMpg] = useState('');
  

  // Fetch years from fueleconomy.gov API on component mount 
  useEffect(() => {
    const fetchYears = async () => {
        try {
            const response = await axios.get(
                'https://www.fueleconomy.gov/ws/rest/vehicle/menu/year'
            );
            const yearsData = response.data.menuItem.map(item => item.value);
            setYears(yearsData);
            setSelectedYear(yearsData[0]); // Select the first year by default
        } catch (error) {
            console.error('Error fetching years:', error);
        }
    };

    fetchYears();
  }, []);

  //Fetch makes based on selected year
  useEffect(() => {
    const fetchMakes = async () => {
        try {
            if (selectedYear) {
                const response = await axios.get(
                    `https://www.fueleconomy.gov/ws/rest/vehicle/menu/make?year=${selectedYear}`
                );
                const makesData = response.data.menuItem.map(item => item.value);
                setMakes(makesData);
                setSelectedMake(makesData[0]); // Select the first make by default
            }
        } catch (error) {
            console.error('Error fetching makes:', error);
        }
    };

    fetchMakes();
  }, [selectedYear]);

  // Fetch models based on selected year and make
  useEffect(() => {
    const fetchModels = async () => {
        try {
            if (selectedYear && selectedMake) {
                const response = await axios.get(
                    `https://www.fueleconomy.gov/ws/rest/vehicle/menu/model?year=${selectedYear}&make=${selectedMake}`
                );
                const modelsData = response.data.menuItem.map(item => ({
                    text: item.text,
                    value: item.value,
                }));
                setModels(modelsData);
                setSelectedModel(modelsData[0]?.value); // Select the first model by default
            }
        } catch (error) {
            console.error('Error fetching models:', error);
        }
    };

    fetchModels();
  }, [selectedYear, selectedMake]);

  // Fetch options based on selected year, make, and model
  useEffect(() => {
    const fetchOptions = async () => {
        try {
            if (selectedYear && selectedMake && selectedModel) {
                const response = await axios.get(
                    `https://www.fueleconomy.gov/ws/rest/vehicle/menu/options?year=${selectedYear}&make=${selectedMake}&model=${selectedModel}`
                );
                const optionsData = response.data.menuItem.map(item => ({
                    text: item.text,
                    value: item.value,
                }));
                setOptions(optionsData);
                setSelectedOption(optionsData[0]?.value); // Select the first option by default
            }
        } catch (error) {
            console.error('Error fetching options:', error);
        }
    };

    fetchOptions();
  }, [selectedYear, selectedMake, selectedModel]);

  // Fetch car MPG based on selected carId
  useEffect(() => {
    const fetchCarMpg = async () => {
        try {
            if (carId) {
                const response = await axios.get(
                    `https://www.fueleconomy.gov/ws/rest/ympg/shared/ympgVehicle/${carId}`
                );
                const carMpgValue = response.data.avgMpg;
                setCarMpg(carMpgValue);
            }
        } catch (error) {
            console.error('Error fetching car MPG:', error);
        }
    };

    fetchCarMpg();
  }, [carId]);

  // Handle change in selected year
  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  // Handle change in selected make
  const handleMakeChange = (event) => {
    setSelectedMake(event.target.value);
  };

  // Handle change in selected model
  const handleModelChange = (event) => {
    setSelectedModel(event.target.value);
  };

  // Handle change in selected option
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
    setCarId(event.target.value); // Set the carId to the selected option's value
  };




////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



  
  //DISTANCE USESTATEHOOK VARIABLES 
  const [startingCity, setStartingCity] = useState('');
  const [destinationCity, setDestinationCity] = useState('');
  const [distance, setDistance] = useState('');
  const [fuelPrice, setFuelPrice] = useState('');
  const [vignetteCosts, setVignetteCosts] = useState([]);
  const [tollCosts, setTollCosts] = useState([]);
  const [vignetteModalOpen, setVignetteModalOpen] = useState(false);
  const [tollModalOpen, setTollModalOpen] = useState(false);
  const [tempVignetteCosts, setTempVignetteCosts] = useState([{ country: '', cost: '' }]);
  const [tempTollCosts, setTempTollCosts] = useState([{ notes: '', cost: '' }]);

  const handleCalculate = () => {
    const formattedStartingCity = encodeURIComponent(startingCity.trim());
    const formattedDestinationCity = encodeURIComponent(destinationCity.trim());

    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${formattedStartingCity}&destination=${formattedDestinationCity}`;

    window.open(googleMapsUrl, '_blank');
  };
  // Handle Vignette
  const handleOpenVignetteModal = () => {
    setTempVignetteCosts([{ country: '', cost: '' }]);
    setVignetteModalOpen(true);
  };

  const handleCloseVignetteModal = () => { 
    setVignetteCosts(tempVignetteCosts);
    setVignetteModalOpen(false);
  };

  const handleVignetteCostChange = (index, field, value) => {
    const newVignetteCosts = [...tempVignetteCosts];
    newVignetteCosts[index][field] = value;
    setTempVignetteCosts(newVignetteCosts);
  };

  const handleAddVignetteRow = () => {
    setTempVignetteCosts([...tempVignetteCosts, { country: '', cost: '' }]);
  };



  // Handle TOLL
  const handleOpenTollModal = () => {
    setTempTollCosts([{ notes: '', cost: '' }]);
    setTollModalOpen(true);
  };

  const handleCloseTollModal = () => {
    setTollCosts(tempTollCosts);
    setTollModalOpen(false);
  };

  const handleTollCostChange = (index, field, value) => {
    const newTollCosts = [...tempTollCosts];
    newTollCosts[index][field] = value;
    setTempTollCosts(newTollCosts);
  };

  const handleAddTollRow = () => {
    setTempTollCosts([...tempTollCosts, { notes: '', cost: '' }]);
  };

  const convertMpgToLpkm = (mpg) => {
    const mpgValue = parseFloat(mpg) || 0;
    return (235.215 / mpgValue).toFixed(2);
  };

  const calculateTotalVignetteCost = () => {
    return vignetteCosts.reduce((total, { cost }) => total + parseFloat(cost || 0), 0).toFixed(2);
  };

  const calculateTotalTollCost = () => {
    return tollCosts.reduce((total, { cost }) => total + parseFloat(cost || 0), 0).toFixed(2);
  };

  const calculateTotalFuelCost = () => {
    const distanceInKm = parseFloat(distance) || 0;
    const pricePerLitre = parseFloat(fuelPrice) || 0;
    const fuelConsumption = parseFloat(convertMpgToLpkm(carMpg)) || 0;
    return ((distanceInKm / 100) * fuelConsumption * pricePerLitre).toFixed(2);
  };

  const calculateTotalCost = () => {
    const totalVignetteCost = parseFloat(calculateTotalVignetteCost()) || 0;
    const totalTollCost = parseFloat(calculateTotalTollCost()) || 0;
    const totalFuelCost = parseFloat(calculateTotalFuelCost()) || 0;
    return (totalVignetteCost + totalTollCost + totalFuelCost).toFixed(2);
  };

  
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <>
      <Container>
      <div className="car-ch">



      

        {/* Vignette Costs Modal */}
        <Dialog open={vignetteModalOpen} onClose={() => setVignetteModalOpen(false)}>
          <DialogTitle>
            Vignette Costs
          </DialogTitle>
          <DialogContent>
            {tempVignetteCosts.map((vignette, index) => (
              <Grid container spacing={2} key={index} alignItems="center">
                <Grid item xs={5}>
                  <TextField
                    label="Country"
                    variant="outlined"
                    fullWidth
                    value={vignette.country}
                    onChange={(e) => handleVignetteCostChange(index, 'country', e.target.value)}
                  />
                </Grid>
                <Grid item xs={5}>
                  <TextField
                    label="Cost"
                    variant="outlined"
                    fullWidth
                    type="number"
                    value={vignette.cost}
                    onChange={(e) => handleVignetteCostChange(index, 'cost', e.target.value)}
                  />
                </Grid>
                <Grid item xs={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddVignetteRow}
                    style={{ height: '100%' }}
                  >
                    Add
                  </Button>
                </Grid>
              </Grid>
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseVignetteModal} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Toll Costs Modal */}
        <Dialog open={tollModalOpen} onClose={() => setTollModalOpen(false)}>
          <DialogTitle>
            Toll Costs
          </DialogTitle>
          <DialogContent>
            {tempTollCosts.map((toll, index) => (
              <Grid container spacing={2} key={index} alignItems="center">
                <Grid item xs={5}>
                  <TextField
                    label="Toll Notes"
                    variant="outlined"
                    fullWidth
                    value={toll.notes}
                    onChange={(e) => handleTollCostChange(index, 'notes', e.target.value)}
                  />
                </Grid>
                <Grid item xs={5}>
                  <TextField
                    label="Cost"
                    variant="outlined"
                    fullWidth
                    type="number"
                    value={toll.cost}
                    onChange={(e) => handleTollCostChange(index, 'cost', e.target.value)}
                  />
                </Grid>
                <Grid item xs={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddTollRow}
                    style={{ height: '100%' }}
                  >
                    Add
                  </Button>
                </Grid>
              </Grid>
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseTollModal} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>






        <Stack spacing={4} direction='column'>
          {/* CAR SELECTION PART */}
          <Paper sx={{ padding: '40px'}} elevation={12}>
              <Stack spacing={2} direction='column'>
                  <Typography variant="h4" color='primary'>Choose car:</Typography>
                          
                  <FormControl fullWidth>
                    <InputLabel>Select Year</InputLabel>
                      <Select
                          value={selectedYear}
                          onChange={handleYearChange}
                          label="Select Year"
                      >
                          {years.map((year) => (
                              <MenuItem key={year} value={year}>
                                  {year}
                              </MenuItem>
                          ))}
                      </Select>
                  </FormControl>

                  <FormControl fullWidth style={{ marginTop: '1rem' }}>
                      <InputLabel>Select Make</InputLabel>
                      <Select
                          value={selectedMake}
                          onChange={handleMakeChange}
                          label="Select Make"
                          disabled={!selectedYear} // Disable until year is selected
                      >
                          {makes.map((make) => (
                              <MenuItem key={make} value={make}>
                                  {make}
                              </MenuItem>
                          ))}
                      </Select>
                  </FormControl>
                  
                  <FormControl fullWidth style={{ marginTop: '1rem' }}>
                      <InputLabel>Select Model</InputLabel>
                      <Select
                          value={selectedModel}
                          onChange={handleModelChange}
                          label="Select Model"
                          disabled={!selectedMake} // Disable until make is selected
                      >
                          {models.map((model) => (
                              <MenuItem key={model.value} value={model.value}>
                                  {model.text}
                              </MenuItem>
                          ))}
                      </Select>
                  </FormControl>
                  
                  <FormControl fullWidth style={{ marginTop: '1rem' }}>
                      <InputLabel>Select Model Option</InputLabel>
                      <Select
                          value={selectedOption}
                          onChange={handleOptionChange}
                          label="Select Model Option"
                          disabled={!selectedModel} // Disable until model is selected
                      >
                          {options.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                  {option.text}
                              </MenuItem>
                          ))}
                      </Select>
                  </FormControl>
                  
                  <div style={{ marginTop: '1rem' }}>
                  <p>Selected Car ID: {carId}</p>
                  <p>Car MPG: {carMpg}</p>
                  </div>
                  <Typography variant="h6" gutterBottom>
                    Fuel Consumption: {convertMpgToLpkm(carMpg)} litres per 100 kilometres
                  </Typography>
              </Stack>
          </Paper> 
            
          
          
          
          
          
          {/* Route Part */}
          <Paper sx={{ padding: '40px'}} elevation={12}>
            <Grid container spacing={2} >
                <Grid item xs={12}>
                    <Typography variant="h4" color='primary'>Choose route:</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography>Enter starting point:</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography>Enter destination point:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Starting City"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={startingCity}
                    onChange={(e) => setStartingCity(e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Destination City"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={destinationCity}
                    onChange={(e) => setDestinationCity(e.target.value)}
                />
                </Grid>

                <Grid item xs={12} padding={2}>
                        <Typography>Enter route distance:</Typography>
                </Grid>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      label="Distance (km)"
                      fullWidth
                      variant="outlined"
                      type="number"
                      value={distance}
                      onChange={(e) => setDistance(e.target.value)}
                      helperText="Enter distance in kilometers"
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      variant="contained"
                      size='large'
                      color="primary"
                      onClick={handleCalculate}
                    >
                      Calculate Distance using Google Maps
                    </Button>
                  </Grid>
                </Grid>
  
            </Grid>
          </Paper>

          
          {/* Fuel Part */}         
          <Paper sx={{ padding: '40px'}} elevation={12}>
              <Grid container spacing={2}>
                  <Grid item xs={12}>
                      <Typography variant="h4" color='primary'>Enter fuel price:</Typography>
                  </Grid>
                  
                  <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      label="Fuel Price (per litre)"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      type="number"
                      value={fuelPrice}
                      onChange={(e) => setFuelPrice(e.target.value)}
                      helperText="Enter fuel price per litre"
                    />
                  </Grid>

                  <Grid item xs={6}></Grid>
                </Grid>

              </Grid>
          </Paper>

          {/* Vignette and Tols Part */}
          <Paper sx={{ padding: '40px'}} elevation={12}>
              <Grid container spacing={2}>
                  <Grid item xs={12}>
                      <Typography variant="h4" color='primary'>Add Vignettes and/or Tolls:</Typography>
                  </Grid>
                  
                  <Grid container spacing={2} paddingTop={2}>
                  <Grid item xs={6}>
                      <Button
                        fullWidth
                        variant="contained"
                        size='large'
                        color="primary"
                        onClick={handleOpenVignetteModal}
                      >
                        Add Vignette costs
                      </Button>
                    </Grid>

                    <Grid item xs={6}>
                      <Button
                        fullWidth
                        variant="contained"
                        size='large'
                        color="secondary"
                        onClick={handleOpenTollModal}
                      >
                        Add toll costs
                      </Button>
                    </Grid>
                  </Grid>  
              </Grid>
          </Paper>



          {/* Total Cost Part */}
          <Paper sx={{ padding: '40px'}} elevation={12}>
                  <Typography variant="h4" color='primary'>Total Cost: ${calculateTotalCost() || '0.00'}</Typography>

                  <Typography variant="h6" gutterBottom>
                    Total Vignette Cost: ${calculateTotalVignetteCost() || '0.00'}
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    Total Toll Cost: ${calculateTotalTollCost() || '0.00'}
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    Total Fuel Cost: ${calculateTotalFuelCost() || '0.00'}
                  </Typography>
          </Paper>

        </Stack>
        </div>
      </Container>
    </>
  );
};
export default TripCalculator;




