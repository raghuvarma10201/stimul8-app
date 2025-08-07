const PROXY_CONFIG = [
    {
      context: ["/api"], // Proxy only requests starting with "/api"
      target: "https://rpwebapps.us", // Replace with your API's URL
      secure: false, // Disable SSL verification if needed
      changeOrigin: true, // Needed for virtual hosted sites
      logLevel: "debug", // Debugging logs
      pathRewrite: { "^/api": "" } // Remove "/api" prefix when forwarding
    }
  ];
  
  export default PROXY_CONFIG;
  