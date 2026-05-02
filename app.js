// Shared data functions for Media Tracker

const SUPABASE_URL = 'https://pnbylilnprmsfmwcvmaw.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Z9GGZVdej2V7cpFOGisC5A_W4zHwcB-';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function getLogs() {
  const { data, error } = await supabase
    .from('logs')
    .select('*')
    .order('date', { ascending: true });
  
  if (error) {
    console.error('Error fetching logs:', error);
    return [];
  }
  return data || [];
}

async function saveLog(date, tasks, notes) {
  const { error } = await supabase
    .from('logs')
    .upsert({ 
      date: date, 
      tasks: tasks, 
      notes: notes 
    }, { onConflict: 'date' });
    
  if (error) {
    console.error('Error saving log:', error);
    throw error;
  }
}

async function getFollowers() {
  const { data, error } = await supabase
    .from('followers')
    .select('*');
    
  if (error) {
    console.error('Error fetching followers:', error);
    return {};
  }
  
  const result = {};
  data.forEach(item => {
    result[item.platform_id] = item.count;
  });
  return result;
}

async function saveFollowers(followersData) {
  const updates = Object.keys(followersData).map(key => ({
    platform_id: key,
    count: followersData[key]
  }));
  
  const { error } = await supabase
    .from('followers')
    .upsert(updates, { onConflict: 'platform_id' });
    
  if (error) {
    console.error('Error saving followers:', error);
    throw error;
  }
}
