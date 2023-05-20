import { React, useEffect, useState } from "react";
import ToDo from "./ToDo";
import axios from "axios";

function App(props) {
  const [data, setData] = useState([]);
  useEffect(() => {
    axios.get("https://jsonplaceholder.typicode.com/posts").then((res) => {
      setData(res.data);
    });
  }, []);
  data.map((d, idx) => d["isDone"] = 'false')
  return <ToDo data={data} />;
}

export default App;
