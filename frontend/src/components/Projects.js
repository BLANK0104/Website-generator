import React, { useState, useEffect } from 'react';
import { Folder, Trash2, Clock, Search } from 'lucide-react';
import { getProjects, deleteProject } from '../services/api';
import './Projects.css';

const Projects = ({ onProjectSelect }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await getProjects();
      setProjects(response.data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load projects');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (projectId, e) => {
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(projectId);
        setProjects(projects.filter(p => p.projectId !== projectId));
      } catch (err) {
        alert('Failed to delete project: ' + err.message);
      }
    }
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="projects-loading">
        <div className="spinner"></div>
        <p>Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="projects">
      <div className="projects-header">
        <h2 className="projects-title">
          <Folder size={24} />
          My Projects
        </h2>
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {filteredProjects.length === 0 ? (
        <div className="projects-empty">
          <Folder size={48} color="#ccc" />
          <h3>No Projects Found</h3>
          <p>
            {searchTerm
              ? 'No projects match your search'
              : 'Start by generating your first website!'}
          </p>
        </div>
      ) : (
        <div className="projects-grid">
          {filteredProjects.map((project) => (
            <div
              key={project.projectId}
              className="project-card"
              onClick={() => onProjectSelect(project)}
            >
              <div className="project-card-header">
                <h3 className="project-name">{project.name}</h3>
                <button
                  className="delete-btn"
                  onClick={(e) => handleDelete(project.projectId, e)}
                  title="Delete project"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              <p className="project-description">{project.description}</p>
              
              {project.components && project.components.length > 0 && (
                <div className="project-components">
                  {project.components.slice(0, 3).map((comp, idx) => (
                    <span key={idx} className="component-tag">
                      {comp}
                    </span>
                  ))}
                  {project.components.length > 3 && (
                    <span className="component-tag">
                      +{project.components.length - 3}
                    </span>
                  )}
                </div>
              )}
              
              <div className="project-footer">
                <span className="project-date">
                  <Clock size={14} />
                  {formatDate(project.metadata.updatedAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
