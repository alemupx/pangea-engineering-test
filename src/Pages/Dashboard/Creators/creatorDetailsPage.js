import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import client from "../../../API"; // Adjust this import to your actual API client's location
import {
  Typography,
  Box,
  Paper,
  Grid,
  AppBar,
  Toolbar,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Link,
} from "@mui/material";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import blitzLogo from "../../../Components/globalAssets/platty.png";
import routes from "../../../Config/routes";
import profilePhoto from "../../../Components/globalAssets/ppfLogo.png"; // Placeholder for the profile photo
const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";
const mapCountryToIsoA3 = (country) => {
  const countryMap = {
    USA: "USA",
    UK: "GBR",
    Mexico: "MEX",
    Canada: "CAN",
    Colombia: "COL",
    // Add more mappings as necessary
  };
  return countryMap[country] || null;
};
const CreatorDetailsPage = () => {
  const { creatorId } = useParams();
  const [creatorDetails, setCreatorDetails] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCreatorDetails = async () => {
      setLoading(true);
      try {
        const response = await client.creators.fetchDetails(creatorId);

        console.log("Received response:", response);
        console.log(client);

        // Directly use the response assuming 'response' already contains the data object
        if (response && Object.keys(response).length > 0) {
          setCreatorDetails(response); // Assuming 'response' is the data object you need
          console.log("Data set for creator:", response);
        } else {
          console.error("Data is empty or undefined.", response);
        }
      } catch (error) {
        console.error("Failed to fetch creator details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (creatorId) {
      fetchCreatorDetails();
    }
  }, [creatorId]);

  if (loading) {
    return <Typography>Loading creator details...</Typography>;
  }

  if (!creatorDetails) {
    return <Typography>No creator details found.</Typography>;
  }

  const highlightedCountries = ["USA", "UK", "Mexico", "Canada", "Colombia"]
    .map(mapCountryToIsoA3)
    .filter(Boolean);

  // Safely parse and calculate data for charts
  const followersData = [
    { name: "TikTok", value: parseInt(creatorDetails.tiktok || 0, 10) },
    { name: "Instagram", value: parseInt(creatorDetails.instagram || 0, 10) },
    { name: "YouTube", value: parseInt(creatorDetails.youtube || 0, 10) },
  ];
  const formatPromotionValue = (value) => {
    const numericValue = parseFloat(
      value.replace("$", "").replace(",", "") || 0
    );
    return numericValue > 999
      ? numericValue.toLocaleString()
      : numericValue.toFixed(2);
  };

  const parseValue = (value) => {
    let result = parseFloat(value);    
    return result;
  };
  const promotionData = [
    {
      name: "TikTok Sound",
      value: parseValue(creatorDetails.tiktok_brand) || "",
    },
    {
      name: "TikTok Brand",
      value: parseValue(creatorDetails.tiktok_sound)|| "",
    },
    {
      name: "Instagram Sound",
      value: creatorDetails.instagram_sound|| "0",
    },  
    {
      name: "Instagram Brand",
      value: creatorDetails.instagram_brand|| "0",
    },
  ];

  const getTotalFollowers = (a, b, c) => {
    return a + b + c;
  };
  
  

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "#000" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="logo"
            onClick={() => navigate(routes.home)}
            sx={{ mr: 2 }}
          >
            <img
              src={blitzLogo}
              alt="logo"
              style={{ width: "120px", height: "50px" }}
            />
          </IconButton>
          {/* Navigation items here, if any */}
        </Toolbar>
      </AppBar>

      <div class="grid sm:grid-cols-1 lg:grid-cols-2">
        {/* Main Details */}

        <div class="col-span-1">
          <div className="flex flex-col items-center pt-8 ">
            <img
              src={creatorDetails.pfphref || profilePhoto}
              className="w-full max-w-72 rounded-full"
            ></img>

            <span className="text-5xl font-bold p-8">
              @{creatorDetails.creator}
            </span>

            <div className="flex flex-col text-center">
              <span className="text-2xl font-bold">
                Geolocation, Gender, Ethnicity:
              </span>
              <span className="text-1xl font-medium">
                {creatorDetails.geolocation_gender_ethnicity}
              </span>
            </div>

            <div className="flex flex-col text-center">
              <span className="text-2xl font-bold pt-8">Content Style:</span>
              <span className="text-1xl font-medium">
                {creatorDetails.notes_content_style}
              </span>
            </div>

            <div className="pt-8 pb-8">
              <span className="text-4xl font-bold p-8">Total Followers:</span>
              <span className="text-4xl font-light ">
                {getTotalFollowers(
                  creatorDetails.instagram,
                  creatorDetails.tiktok,
                  creatorDetails.youtube
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Social Networks */}

        <div class="col-span-1">
          <div className="flex gap-4 pt-8 md:flex-col lg:flex-row justify-evenly">
            {/* IG */}
            <div className="flex">
              <a
                className="cursor-pointer"
                href={creatorDetails.instagram_link}
              >
                <svg
                  className="w-20 h-20 bg-red-500"
                  viewBox="0 0 200 200"
                  fill="white"
                >
                  <path d="M65 16.6667H135C161.667 16.6667 183.333 38.3334 183.333 65.0001V135C183.333 147.819 178.241 160.113 169.177 169.177C160.113 178.241 147.819 183.333 135 183.333H65C38.3333 183.333 16.6667 161.667 16.6667 135V65.0001C16.6667 52.1813 21.7589 39.8875 30.8232 30.8233C39.8874 21.759 52.1812 16.6667 65 16.6667ZM63.3333 33.3334C55.3768 33.3334 47.7462 36.4941 42.1201 42.1202C36.494 47.7463 33.3333 55.3769 33.3333 63.3334V136.667C33.3333 153.25 46.75 166.667 63.3333 166.667H136.667C144.623 166.667 152.254 163.506 157.88 157.88C163.506 152.254 166.667 144.623 166.667 136.667V63.3334C166.667 46.7501 153.25 33.3334 136.667 33.3334H63.3333ZM143.75 45.8334C146.513 45.8334 149.162 46.9309 151.116 48.8844C153.069 50.8379 154.167 53.4874 154.167 56.2501C154.167 59.0128 153.069 61.6623 151.116 63.6158C149.162 65.5693 146.513 66.6668 143.75 66.6668C140.987 66.6668 138.338 65.5693 136.384 63.6158C134.431 61.6623 133.333 59.0128 133.333 56.2501C133.333 53.4874 134.431 50.8379 136.384 48.8844C138.338 46.9309 140.987 45.8334 143.75 45.8334ZM100 58.3334C111.051 58.3334 121.649 62.7233 129.463 70.5373C137.277 78.3513 141.667 88.9494 141.667 100C141.667 111.051 137.277 121.649 129.463 129.463C121.649 137.277 111.051 141.667 100 141.667C88.9493 141.667 78.3512 137.277 70.5372 129.463C62.7232 121.649 58.3333 111.051 58.3333 100C58.3333 88.9494 62.7232 78.3513 70.5372 70.5373C78.3512 62.7233 88.9493 58.3334 100 58.3334ZM100 75.0001C93.3696 75.0001 87.0107 77.634 82.3223 82.3224C77.6339 87.0108 75 93.3697 75 100C75 106.631 77.6339 112.989 82.3223 117.678C87.0107 122.366 93.3696 125 100 125C106.63 125 112.989 122.366 117.678 117.678C122.366 112.989 125 106.631 125 100C125 93.3697 122.366 87.0108 117.678 82.3224C112.989 77.634 106.63 75.0001 100 75.0001Z"></path>
                </svg>
              </a>

              <span className="flex items-center text-4xl font-bold pl-2 ">
                {creatorDetails.instagram}
              </span>
            </div>

            {/* TT */}
            <div className="flex">
              <a className="cursor-pointer" href={creatorDetails.tiktok_link}>
                <svg
                  className="w-20 h-20 bg-black"
                  viewBox="0 0 200 200"
                  fill="white"
                >
                  <path d="M107.867 13.4255V131.484C107.867 144.526 97.2917 155.092 84.2583 155.092C71.2167 155.092 60.65 144.517 60.65 131.484C60.65 118.442 71.225 107.876 84.2583 107.876V76.3922C53.8333 76.3922 29.1667 101.059 29.1667 131.484C29.1667 161.909 53.8333 186.576 84.2583 186.576C114.683 186.576 139.35 161.909 139.35 131.484V76.3922L141.008 77.2255C150.267 81.8589 160.475 84.2672 170.825 84.2672V52.7755L169.883 52.5422C151.933 48.0589 139.342 31.9255 139.342 13.4255H107.867Z"></path>
                </svg>
              </a>
              <span className="flex items-center text-4xl font-bold pl-2">
                {creatorDetails.tiktok}
              </span>
            </div>

            {/* YT */}
            <div className="flex">
              <a className="cursor-pointer" href={creatorDetails.youtube_link}>
                <svg
                  className="w-20 h-20 bg-red-600"
                  viewBox="0 0 200 200"
                  fill="white"
                >
                  <path d="M83.3333 125L126.583 100L83.3333 75.0001V125ZM179.667 59.7501C180.75 63.6667 181.5 68.9167 182 75.5834C182.583 82.2501 182.833 88.0001 182.833 93.0001L183.333 100C183.333 118.25 182 131.667 179.667 140.25C177.583 147.75 172.75 152.583 165.25 154.667C161.333 155.75 154.167 156.5 143.167 157C132.333 157.583 122.417 157.833 113.25 157.833L100 158.333C65.0833 158.333 43.3333 157 34.75 154.667C27.25 152.583 22.4166 147.75 20.3333 140.25C19.25 136.333 18.5 131.083 18 124.417C17.4166 117.75 17.1666 112 17.1666 107L16.6666 100C16.6666 81.7501 18 68.3334 20.3333 59.7501C22.4166 52.2501 27.25 47.4167 34.75 45.3334C38.6666 44.2501 45.8333 43.5001 56.8333 43.0001C67.6666 42.4167 77.5833 42.1667 86.75 42.1667L100 41.6667C134.917 41.6667 156.667 43.0001 165.25 45.3334C172.75 47.4167 177.583 52.2501 179.667 59.7501Z"></path>
                </svg>
              </a>
              <span className="flex items-center text-4xl font-bold pl-2">
                {creatorDetails.youtube}
              </span>
            </div>
          </div>

          <div class="pt-12">

          <div className="flex flex-col text-center">
              <span className="text-2xl font-bold">Followers Distribution</span>
            </div>
            
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={followersData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {followersData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={["#0088FE", "#00C49F", "#FFBB28"][index]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div class="pt-18">
            <div className="flex flex-col text-center">
              <span className="text-2xl font-bold">Promotion Rates ($)</span>
            </div>

            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={promotionData}>
                <XAxis dataKey="name" />
                <YAxis dataKey="value"/>
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <Box sx={{ flexGrow: 1, padding: 3, backgroundColor: "#f5f5f5" }}>
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          <Grid item xs={12} sm={4}>
            <Box
              component="img"
              src={creatorDetails.pfphref || profilePhoto}
              alt="Profile"
              sx={{
                width: "100%",
                maxWidth: 120,
                height: "auto",
                borderRadius: "50%",
              }}
            />
          </Grid>
          <Grid item xs={12} sm={8}>
            <Typography variant="h4" gutterBottom>
              @{creatorDetails.creator}
            </Typography>
          </Grid>
        </Grid>

        <Paper sx={{ padding: 2, margin: "20px 0" }}>
          <Typography variant="body1">
            <strong>TikTok Profile:</strong>{" "}
            <a
              href={creatorDetails.tiktok_link}
              target="_blank"
              rel="noopener noreferrer"
            >
              View TikTok
            </a>
          </Typography>
          <Typography variant="body1">
            <strong>Instagram Profile:</strong>{" "}
            <a
              href={creatorDetails.instagram_link}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Instagram
            </a>
          </Typography>
          <Typography variant="body1">
            <strong>YouTube Channel:</strong>{" "}
            <a
              href={creatorDetails.youtube_link}
              target="_blank"
              rel="noopener noreferrer"
            >
              View YouTube
            </a>
          </Typography>
          {/* Followers Distribution */}
          <Grid item xs={12} md={6}>
            <Typography variant="body1">
              <strong>Presented By:</strong> {creatorDetails.manager}
            </Typography>
            <Typography variant="body1">
              <strong>TikTok Followers:</strong> {creatorDetails.tiktok}
            </Typography>
            <Typography variant="body1">
              <strong>Instagram Followers:</strong> {creatorDetails.instagram}
            </Typography>
            <Typography variant="body1">
              <strong>YouTube Subscribers:</strong> {creatorDetails.youtube}
            </Typography>
            <Typography variant="h6" gutterBottom>
              Followers Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={followersData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {followersData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={["#0088FE", "#00C49F", "#FFBB28"][index]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Grid>
        </Paper>

        {/* Promotion Rates */}
        <Paper sx={{ padding: 2, margin: "20px 0" }}>
          <Typography variant="h6" gutterBottom>
            Promotion Rates ($)
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={promotionData}>
              <XAxis dataKey="name" />
              <YAxis dataKey="value" />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
          <List>
            {promotionData.map((data) => (
              <ListItem key={data.name}>
                <ListItemText primary={`${data.name}: $${data.value}`} />
              </ListItem>
            ))}
          </List>
        </Paper>

        {/* Additional Details */}
        <Paper sx={{ padding: 2, margin: "20px 0" }}>
          <Typography variant="body1">
            <strong>Geolocation & Ethnicity:</strong>{" "}
            {creatorDetails.geolocation_gender_ethnicity}
          </Typography>
          <Typography variant="body1">
            <strong>Content Style:</strong> {creatorDetails.notes_content_style}
          </Typography>
          <ComposableMap>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const isHighlighted = highlightedCountries.includes(
                    geo.properties.ISO_A3
                  );
                  return isHighlighted ? (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="#FF5533"
                    />
                  ) : null; // Don't render unhighlighted geographies to clean up the map
                }).length > 0 ? (
                  geographies.map((geo) => (
                    <Geography key={geo.rsmKey} geography={geo} fill="#DDD" />
                  ))
                ) : (
                  <Typography sx={{ textAlign: "center" }}>
                    Creator can't be mapped.
                  </Typography>
                )
              }
            </Geographies>
          </ComposableMap>
        </Paper>
      </Box>
    </>
  );
};

export default CreatorDetailsPage;
