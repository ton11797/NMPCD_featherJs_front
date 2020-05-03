export default [
  {
    _name: 'CSidebarNav',
    _children: [
      {
        _name: 'CSidebarNavItem',
        name: 'Dashboard',
        to: '/dashboard',
        icon: 'cil-speedometer',
        badge: {
          color: 'primary',
          text: 'NEW'
        }
      },
      {
        _name: 'CSidebarNavTitle',
        _children: ['Management'],
        requireAuth:true
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Search Linked Data',
        to: '/manage/searchRelate',
        icon: 'cil-pencil',
        requireAuth:true
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Schema Management',
        to: '/manage/schema',
        icon: 'cil-pencil',
        requireAuth:true
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Schema Link Management',
        to: '/manage/schemaLink',
        icon: 'cil-pencil',
        requireAuth:true
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Link Management',
        to: '/manage/dataLink',
        icon: 'cil-pencil',
        requireAuth:true
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Data Management',
        to: '/manage/data',
        icon: 'cil-pencil',
        requireAuth:true
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Confirmation Data',
        to: '/manage/confirmation',
        icon: 'cil-pencil',
        requireAuth:true
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Confirmation Data Link',
        to: '/manage/confirmationLink',
        icon: 'cil-pencil',
        requireAuth:true
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Auto Mapping Data',
        to: '/manage/autoMapping',
        icon: 'cil-pencil',
        requireAuth:true
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Version Management',
        to: '/manage/version',
        icon: 'cil-pencil',
        requireAuth:true
      },
      {
        _name: 'CSidebarNavItem',
        name: 'User Management',
        to: '/manage/user',
        icon: 'cil-pencil',
        requireAuth:true
      },
      {
        _name: 'CSidebarNavItem',
        name: 'System Management',
        to: '/manage/system',
        icon: 'cil-pencil',
        requireAuth:true
      }
    ]
  }
]