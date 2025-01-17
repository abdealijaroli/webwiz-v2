interface Website {
  id: string;
  name: string;
  description?: string;
  html?: string;
  css?: string;
  javascript?: string;
  createdAt: string;
  updatedAt: string;
}

// In-memory storage for development
let websites: Website[] = [];

export const resolvers = {
  Query: {
    websites: () => websites,
    website: (_: any, { id }: { id: string }) => 
      websites.find(website => website.id === id),
  },
  
  Mutation: {
    createWebsite: (_: any, { 
      name, 
      description, 
      html, 
      css, 
      javascript 
    }: { 
      name: string;
      description?: string;
      html?: string;
      css?: string;
      javascript?: string;
    }) => {
      const website: Website = {
        id: Date.now().toString(),
        name,
        description,
        html,
        css,
        javascript,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      websites.push(website);
      return website;
    },
    
    updateWebsite: (_: any, { 
      id,
      name, 
      description, 
      html, 
      css, 
      javascript 
    }: { 
      id: string;
      name?: string;
      description?: string;
      html?: string;
      css?: string;
      javascript?: string;
    }) => {
      const index = websites.findIndex(website => website.id === id);
      if (index === -1) throw new Error('Website not found');
      
      const website = websites[index];
      const updatedWebsite = {
        ...website,
        name: name ?? website.name,
        description: description ?? website.description,
        html: html ?? website.html,
        css: css ?? website.css,
        javascript: javascript ?? website.javascript,
        updatedAt: new Date().toISOString(),
      };
      
      websites[index] = updatedWebsite;
      return updatedWebsite;
    },
    
    deleteWebsite: (_: any, { id }: { id: string }) => {
      const initialLength = websites.length;
      websites = websites.filter(website => website.id !== id);
      return websites.length !== initialLength;
    },
  },
};