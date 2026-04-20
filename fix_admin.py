import re
c = open('src/app/admin/users/page.tsx', 'r', encoding='utf-8').read()
c = c.replace('import { useState } from', 'import { useState, useEffect } from')
c = c.replace('const { users, updateUserBalance', 'const [dbUsers,setDbUsers]=useState<any[]>([]); const [loading,setLoading]=useState(true); const {user:_adminUser,updateUserBalance')
c = c.replace('const filteredUsers = users.filter', 'const fetchUsers=async()=>{setLoading(true);try{const r=await fetch(\'/api/users\');const d=await r.json();if(d.success)setDbUsers(d.data);}catch(e){console.error(e);}setLoading(false);}; useEffect(()=>{fetchUsers();},[]); const users=dbUsers; const filteredUsers=users.filter')
open('src/app/admin/users/page.tsx', 'w', encoding='utf-8').write(c)
print('done')
