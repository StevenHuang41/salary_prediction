const deleteBestDir = async () => {
  const res = await fetch(
    'http://192.168.1.3:8000/api/refresh_model',
    {method: 'DELETE'}
  );
  if (!res.ok) {
    const resMessage = await res.json();
    throw new Error(resMessage.message || 'Delete failed.')
  }
  return await res.json();
};

export { deleteBestDir };
    
