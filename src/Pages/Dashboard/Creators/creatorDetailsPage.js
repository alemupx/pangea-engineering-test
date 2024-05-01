import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import client from "../../../API"; // Adjust this import to your actual API client's location
import { Typography, AppBar, Toolbar, IconButton } from "@mui/material";
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
  Rectangle,
  Cell,
} from "recharts";
import blitzLogo from "../../../Components/globalAssets/platty.png";
import routes from "../../../Config/routes";
import profilePhoto from "../../../Components/globalAssets/ppfLogo.png"; // Placeholder for the profile photo

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
    return (
      <>
        <div className="flex justify-center items-center pt-80">
          <svg
            fill="currentColor"
            class="w-12 h-12 animate-spin"
            viewBox="0 0 16 16"
          >
            <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z" />
            <path
              fill-rule="evenodd"
              d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"
            />
          </svg>
        </div>
      </>
    );
  }

  if (!creatorDetails) {
    return <Typography>No creator details found.</Typography>;
  }

  const parseValue = (value) => {
    let response;
    if (value != null) {
      response = value.replace(/[^0-9.-]+/g, "");
    }else{
      response = 0;
    }
    return response;
  };

  const formatValue = (value) => {
    let response = value
      .toLocaleString("es-MX", {
        minimumFractionDigits: 0, // Remove trailing zeros
        maximumFractionDigits: 2, // Set the number of decimal places
        useGrouping: true, // Enable grouping (thousands separators)
      })
      .replace(/\./g, ",");
    return response;
  };

  const formatFollowersValues = (value) => {
    let response = parseInt(parseValue(value));
    return response;
  };

  const getTotalFollowers = (a, b, c) => {
    let a2 = parseValue(a);
    let b2 = parseValue(b);
    let c2 = parseValue(c);

    let result = parseInt(a2) + parseInt(b2) + parseInt(c2);

    result = formatValue(result);

    return result;
  };

  const creatorInfo = {
    gender: "",
    location: "",
    ethnicity: "",
  };

  const getCreatorInfo = (value) => {
    let result;

    const regex = /\/+/g;
    const partes = value.split(regex).filter((parte) => parte.trim());

    creatorInfo.location = partes[0];
    creatorInfo.gender = partes[1];
    creatorInfo.ethnicity = partes[2];
  };

  /* Parse data for the bar chart */
  const promotionData = [
    {
      name: "TikTok Sound",
      value: parseValue(creatorDetails.tiktok_sound) || "0",
    },
    {
      name: "TikTok Brand",
      value: parseValue(creatorDetails.tiktok_brand) || "0",
    },
    {
      name: "Instagram Sound",
      value: parseValue(creatorDetails.ig_reels_sound) || "0",
    },
    {
      name: "Instagram Brand",
      value: parseValue(creatorDetails.ig_reels_brand) || "0",
    },
  ];

  // Parse data for pie chart
  const followersData = [
    { name: "TikTok", value: formatFollowersValues(creatorDetails.tiktok) },
    {
      name: "Instagram",
      value: formatFollowersValues(creatorDetails.instagram),
    },
    { name: "YouTube", value: formatFollowersValues(creatorDetails.youtube) },
  ];



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
      
      <div class="grid sm:grid-cols-1 lg:grid-cols-2 m-4">
        {/* Main Details */}
        <div class="col-span-1 bg-black text-white">
          <div className=" flex flex-col items-center pt-8 ">
            <img
              src={creatorDetails.pfphref || profilePhoto}
              className="w-full max-w-44 rounded-full border-white border-solid"
            />

            <span className=" select-none text-5xl font-bold p-8">
              @{creatorDetails.creator}
            </span>

            {/* Social Networks */}
            <div className="flex gap-4 pt-4 flex-row items-center">
              {/* IG */}

              {creatorDetails.instagram != null && (
                <a
                  className="flex cursor-pointer hover:animate-pulse"
                  target="_blank"
                  href={creatorDetails.instagram_link}
                >
                  <div>
                    <svg
                      className="w-10 h-10"
                      viewBox="0 0 200 200"
                      fill="white"
                    >
                      <path d="M65 16.6667H135C161.667 16.6667 183.333 38.3334 183.333 65.0001V135C183.333 147.819 178.241 160.113 169.177 169.177C160.113 178.241 147.819 183.333 135 183.333H65C38.3333 183.333 16.6667 161.667 16.6667 135V65.0001C16.6667 52.1813 21.7589 39.8875 30.8232 30.8233C39.8874 21.759 52.1812 16.6667 65 16.6667ZM63.3333 33.3334C55.3768 33.3334 47.7462 36.4941 42.1201 42.1202C36.494 47.7463 33.3333 55.3769 33.3333 63.3334V136.667C33.3333 153.25 46.75 166.667 63.3333 166.667H136.667C144.623 166.667 152.254 163.506 157.88 157.88C163.506 152.254 166.667 144.623 166.667 136.667V63.3334C166.667 46.7501 153.25 33.3334 136.667 33.3334H63.3333ZM143.75 45.8334C146.513 45.8334 149.162 46.9309 151.116 48.8844C153.069 50.8379 154.167 53.4874 154.167 56.2501C154.167 59.0128 153.069 61.6623 151.116 63.6158C149.162 65.5693 146.513 66.6668 143.75 66.6668C140.987 66.6668 138.338 65.5693 136.384 63.6158C134.431 61.6623 133.333 59.0128 133.333 56.2501C133.333 53.4874 134.431 50.8379 136.384 48.8844C138.338 46.9309 140.987 45.8334 143.75 45.8334ZM100 58.3334C111.051 58.3334 121.649 62.7233 129.463 70.5373C137.277 78.3513 141.667 88.9494 141.667 100C141.667 111.051 137.277 121.649 129.463 129.463C121.649 137.277 111.051 141.667 100 141.667C88.9493 141.667 78.3512 137.277 70.5372 129.463C62.7232 121.649 58.3333 111.051 58.3333 100C58.3333 88.9494 62.7232 78.3513 70.5372 70.5373C78.3512 62.7233 88.9493 58.3334 100 58.3334ZM100 75.0001C93.3696 75.0001 87.0107 77.634 82.3223 82.3224C77.6339 87.0108 75 93.3697 75 100C75 106.631 77.6339 112.989 82.3223 117.678C87.0107 122.366 93.3696 125 100 125C106.63 125 112.989 122.366 117.678 117.678C122.366 112.989 125 106.631 125 100C125 93.3697 122.366 87.0108 117.678 82.3224C112.989 77.634 106.63 75.0001 100 75.0001Z"></path>
                    </svg>
                  </div>

                  <span className="flex items-center text-43xl font-light pl-2 select-none ">
                    {creatorDetails.instagram}
                  </span>
                </a>
              )}

              {/* TT */}

              {creatorDetails.tiktok != null && (
                <a
                className="flex cursor-pointer hover:animate-pulse"
                target="_blank"
                href={creatorDetails.tiktok_link}
              >
                <div>
                  <svg className="w-10 h-10" viewBox="0 0 200 200" fill="white">
                    <path d="M107.867 13.4255V131.484C107.867 144.526 97.2917 155.092 84.2583 155.092C71.2167 155.092 60.65 144.517 60.65 131.484C60.65 118.442 71.225 107.876 84.2583 107.876V76.3922C53.8333 76.3922 29.1667 101.059 29.1667 131.484C29.1667 161.909 53.8333 186.576 84.2583 186.576C114.683 186.576 139.35 161.909 139.35 131.484V76.3922L141.008 77.2255C150.267 81.8589 160.475 84.2672 170.825 84.2672V52.7755L169.883 52.5422C151.933 48.0589 139.342 31.9255 139.342 13.4255H107.867Z"></path>
                  </svg>
                </div>

                <span className="flex items-center text-43xl font-light pl-2 select-none ">
                  {creatorDetails.tiktok}
                </span>
              </a>
              )}
              
              

              {/* YT */}

              {creatorDetails.youtube != null && (
                <a
                  className="flex cursor-pointer hover:animate-pulse"
                  target="_blank"
                  href={creatorDetails.youtube_link}
                >
                  <div>
                    <svg
                      className="w-10 h-10 hover:text-cyan-100"
                      viewBox="0 0 200 200"
                      fill="white"
                    >
                      <path d="M83.3333 125L126.583 100L83.3333 75.0001V125ZM179.667 59.7501C180.75 63.6667 181.5 68.9167 182 75.5834C182.583 82.2501 182.833 88.0001 182.833 93.0001L183.333 100C183.333 118.25 182 131.667 179.667 140.25C177.583 147.75 172.75 152.583 165.25 154.667C161.333 155.75 154.167 156.5 143.167 157C132.333 157.583 122.417 157.833 113.25 157.833L100 158.333C65.0833 158.333 43.3333 157 34.75 154.667C27.25 152.583 22.4166 147.75 20.3333 140.25C19.25 136.333 18.5 131.083 18 124.417C17.4166 117.75 17.1666 112 17.1666 107L16.6666 100C16.6666 81.7501 18 68.3334 20.3333 59.7501C22.4166 52.2501 27.25 47.4167 34.75 45.3334C38.6666 44.2501 45.8333 43.5001 56.8333 43.0001C67.6666 42.4167 77.5833 42.1667 86.75 42.1667L100 41.6667C134.917 41.6667 156.667 43.0001 165.25 45.3334C172.75 47.4167 177.583 52.2501 179.667 59.7501Z"></path>
                    </svg>
                  </div>

                  <span className="flex items-center text-43xl font-light pl-2 select-none ">
                    {creatorDetails.youtube}
                  </span>
                </a>
              )}
            </div>

            {/* Total Followers */}
            <div className="select-none py-10 text-center">
              <span className="text-3xl font-bold p-8">Total Followers:</span>
              <span className="text-3xl font-light ">
                {getTotalFollowers(
                  creatorDetails.instagram,
                  creatorDetails.tiktok,
                  creatorDetails.youtube
                )}
              </span>
            </div>
          </div>

          <hr class="my-1 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:via-neutral-400" />

          {/* Creator Details */}
          {getCreatorInfo(creatorDetails.geolocation_gender_ethnicity)}
          <div className="grid grid-cols-2 pb-8 select-none">
            <div className="col-span-1">
              <div className="flex flex-col text-center">
                <span className="text-2xl font-bold pt-8">Gender</span>
                <span className="text-1xl font-light">
                  {creatorInfo.gender || "Null"}
                </span>
              </div>

              <div className="flex flex-col text-center">
                <span className="text-2xl font-bold pt-8">Ethnicity</span>
                <span className="text-1xl font-light">
                  {creatorInfo.ethnicity || "Null"}
                </span>
              </div>
            </div>
            <div className="col-span-1">
              <div className="flex flex-col text-center">
                <span className="text-2xl font-bold pt-8">Content Style</span>
                <span className="text-1xl font-light">
                  {creatorDetails.notes_content_style || "Null"}
                </span>
              </div>

              <div className="flex flex-col text-center">
                <span className="text-2xl font-bold pt-8">Geolocation</span>
                <span className="text-1xl font-light">
                  {creatorInfo.location || "Null"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div class="col-span-1">
          {/* Pie Chart */}
          <div>
            <div className="select-none flex flex-col text-center">
              <span className="text-2xl font-bold py-8">
                Followers Distribution
              </span>
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
                      fill={["#365B73", "#5C6A73", "#64869D"][index]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div>
            <div className="select-none flex flex-col text-center">
              <span className="text-2xl font-bold py-8">
                Promotion Rates ($)
              </span>
            </div>

            <ResponsiveContainer width="100%" height={250}>
              <BarChart className="px-10" data={promotionData}>
                <XAxis dataKey="name" />
                <YAxis dataKey="value" />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="value"
                  fill="#000000"
                  activeBar={<Rectangle fill="#5C6A73" stroke="black" />}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <footer
        className="select-none"
        sx={{ mt: 4, backgroundColor: "#f5f5f5", p: 2, textAlign: "center" }}
      >
        <Typography variant="body2" color="textSecondary">
          © 2023 Pangea, Inc. All rights reserved.
        </Typography>
      </footer>
    </>
  );
};

export default CreatorDetailsPage;
