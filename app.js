const SUPABASE_URL = 'https://pnbylilnprmsfmwcvmaw.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Z9GGZVdej2V7cpFOGisC5A_W4zHwcB-';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function getLogs() {
  const { data, error } = await supabaseClient
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
  const { error } = await supabaseClient
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
  const { data, error } = await supabaseClient
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
  
  const { error } = await supabaseClient
    .from('followers')
    .upsert(updates, { onConflict: 'platform_id' });
    
  if (error) {
    console.error('Error saving followers:', error);
    throw error;
  }
}

async function getIgPosts() {
  const { data, error } = await supabaseClient
    .from('ig_posts')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching IG posts:', error);
    return [];
  }
  return data || [];
}

async function saveIgPost(account, date, content) {
  const { error } = await supabaseClient
    .from('ig_posts')
    .insert([{ 
      account: account, 
      date: date, 
      content: content 
    }]);
    
  if (error) {
    console.error('Error saving IG post:', error);
    throw error;
  }
}

async function getPunches() {
  const { data, error } = await supabaseClient
    .from('attendance')
    .select('*')
    .order('date', { ascending: false });
    
  if (error) {
    console.error('Error fetching attendance:', error);
    return [];
  }
  return data || [];
}

async function savePunch(date, status, time) {
  const { error } = await supabaseClient
    .from('attendance')
    .upsert({ 
      date: date, 
      status: status, 
      time: time 
    }, { onConflict: 'date' });
    
  if (error) {
    console.error('Error saving attendance:', error);
    throw error;
  }
}
