const fetchData = async (path) => {
  const res = await fetch(`http://localhost:8000/api/${path}`);
  if (!res.ok) throw new Error(`Failed to fetch, path=${path}`);

  const data = await res.json()
  return data
};

const getUniqJobTitle = async () => {
  const data = await fetchData('get_uniq_job_title');
  return data
}


export { fetchData, getUniqJobTitle };