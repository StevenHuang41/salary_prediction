const fetchData = async (path) => {
  try {
    const res = await fetch(`http://localhost:8000/api${path}`);
    if (!res.ok) throw new Error(`Failed to fetch, path=${path}\n
                                  ${res.status} ${res.statusText}`);
    return await res.json();
  } catch (err) {
    console.error(`Fetch failed for ${path}:`, err)
    throw err;
  }
};

const getUniqJobTitle = async () => {
  return await fetchData('/get_uniq_job_title');
}

const predictSalary = async (formData) => {
  try {
    const res = await fetch('http://localhost:8000/api/predict', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message)
    }
    return await res.json()
  } catch (err) {
    throw err;
  }
};


export { fetchData, getUniqJobTitle, predictSalary };