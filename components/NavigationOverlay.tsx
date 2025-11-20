
import React, { useState } from 'react';

// --- Project Data Structure ---
const projectsData = [
  {
    id: 'asen',
    title: 'Åsen 42A, Nexø',
    tag: 'IN PROGRESS / 2025',
    description: 'Design & Build. A modern architectural intervention integrated into the hillside landscape. Features a minimalist concrete structure with green roofing to blend seamlessly with the surrounding nature of Bornholm. Focus on sustainable materials and energy-efficient design.',
    images: [
      'https://images.unsplash.com/photo-1505576391880-b3f9d713dc4f?q=80&w=2070&auto=format&fit=crop', // Hero: Concrete house
      'https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2000&auto=format&fit=crop', // Garden view
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=2000&auto=format&fit=crop', // Green roof texture
    ]
  },
  {
    id: 'tesla',
    title: 'Tesla Gigafactory',
    tag: 'RAMBØLL / 2020',
    description: 'Berlin, Germany. Comprehensive BIM Coordination and collision detection for one of the world\'s most advanced automotive manufacturing facilities. Managed complex multi-disciplinary models (Robotics, MEP, Structural) to ensure construction efficiency on a massive scale.',
    images: [
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=2070&auto=format&fit=crop', // Factory Exterior
      'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=2000&auto=format&fit=crop', // Tech tunnel
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2000&auto=format&fit=crop', // Robotics
    ]
  },
  {
    id: 'malmo',
    title: 'Malmö Hospital',
    tag: 'RAMBØLL / 2021',
    description: 'Malmö, Sweden. New hospital construction and total renovation (Building 50). Generated high-fidelity 3D models from point-cloud scans and led BIM coordination strategies for large-scale healthcare infrastructure.',
    images: [
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2000&auto=format&fit=crop', // Hospital Hero
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=2000&auto=format&fit=crop', // Clean lines
      'https://images.unsplash.com/photo-1587351021759-3e566b9c4222?q=80&w=2000&auto=format&fit=crop', // Structure
    ]
  },
  {
    id: 'novo',
    title: 'Novo Nordisk (Building 25A)',
    tag: 'RH ARKITEKTER / 2022-2024',
    description: 'Hillerød, Denmark. Advanced laboratory and office extension. Delivered detailed tender material and structural 3D modeling for specialized pharmaceutical environments requiring extreme precision.',
    images: [
      'https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=2000&auto=format&fit=crop', // Lab building
      'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=2000&auto=format&fit=crop', // Lab Interior
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=2000&auto=format&fit=crop', // Clean room
    ]
  }
];

// --- Sub-Component: Dynamic Project Gallery ---
const ProjectGallery = ({ project }) => {
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  const cardContainerStyle = {
    width: '100%',
    maxWidth: '1000px',
    marginBottom: '80px',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  };

  const mainImageContainerStyle = {
    width: '100%',
    height: '450px', // Default desktop height
    backgroundColor: '#333',
    position: 'relative',
    overflow: 'hidden',
    border: '1px solid #444',
  };

  const mainImageStyle = {
    width: '100%',
    height: '100%',
    backgroundImage: `url(${project.images[activeImgIndex]})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    transition: 'background-image 0.3s ease-in-out', // Smooth transition
  };

  const tagStyle = {
    position: 'absolute',
    top: '10px',
    left: '10px',
    background: 'black',
    color: 'white',
    padding: '5px 10px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    zIndex: 2,
  };

  const thumbnailRowStyle = {
    display: 'flex',
    gap: '10px',
    marginTop: '5px',
    overflowX: 'auto',
  };

  return (
    <div style={cardContainerStyle}>
      {/* Main Dynamic Display */}
      <div style={mainImageContainerStyle}>
        <div style={tagStyle}>{project.tag}</div>
        <div style={mainImageStyle} />
      </div>

      {/* Thumbnail Strip */}
      <div style={thumbnailRowStyle}>
        {project.images.map((img, index) => (
          <div 
            key={index}
            onClick={() => setActiveImgIndex(index)}
            style={{
              width: '100px',
              height: '70px',
              backgroundImage: `url(${img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              cursor: 'none', // Custom cursor
              border: index === activeImgIndex ? '2px solid white' : '1px solid #444',
              opacity: index === activeImgIndex ? 1 : 0.5,
              transition: 'all 0.2s',
              flexShrink: 0,
            }}
          />
        ))}
      </div>

      <h2 style={{ fontSize: '1.8rem', marginTop: '10px' }}>{project.title}</h2>
      <p style={{ color: '#ccc', lineHeight: '1.6', maxWidth: '800px' }}>
        {project.description}
      </p>
    </div>
  );
};


export const NavigationOverlay = () => {
  const [activeSection, setActiveSection] = useState(null);

  const handleClose = () => setActiveSection(null);

  // --- Styles ---

  const overlayContainerStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 100,
    pointerEvents: 'none',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: '3rem',
  };

  const buttonGroupStyle = {
    display: 'flex',
    gap: '4rem', // Increased for centering
    pointerEvents: 'auto',
    zIndex: 102,
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%', // Ensure it takes full width for centering
  };

  const buttonStyle = (isActive) => ({
    background: isActive ? '#fff' : 'rgba(0,0,0,0.5)',
    color: isActive ? '#000' : '#fff',
    border: '2px solid #fff',
    padding: '0.8rem 1.5rem',
    fontFamily: 'monospace',
    fontSize: '1rem',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    cursor: 'none',
    transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    transform: isActive ? 'scale(1.1)' : 'scale(1)',
    outline: 'none',
    marginBottom: '10px',
  });

  // Styles for the Sticky Close Button
  const floatingCloseContainerStyle = {
    position: 'fixed',
    bottom: '30px',
    left: '0',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    zIndex: 200, // Above everything
    pointerEvents: 'auto',
  };

  const floatingCloseButtonStyle = {
    background: '#000',
    border: '2px solid #fff',
    color: '#fff',
    padding: '15px 40px',
    fontFamily: 'monospace',
    fontSize: '1.2rem',
    cursor: 'none',
    textTransform: 'uppercase',
    letterSpacing: '3px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
    transition: 'transform 0.2s',
  };

  // --- Modal Styles ---

  // PROFILE (Iris)
  const profileModalStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: '#ffffff',
    color: '#000000',
    zIndex: 150,
    pointerEvents: activeSection === 'profile' ? 'auto' : 'none',
    clipPath: activeSection === 'profile' ? 'circle(150% at 50% 90%)' : 'circle(0% at 50% 90%)',
    transition: 'clip-path 0.8s cubic-bezier(0.77, 0, 0.175, 1)',
    overflowY: 'auto',
    padding: '80px 20px 100px 20px', // Extra padding bottom for floating button
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  // COMPANY (Hydraulic)
  const companyPanelStyle = (direction) => ({
    position: 'fixed',
    left: 0,
    width: '100vw',
    height: '50vh',
    backgroundColor: '#000000',
    color: '#ffffff',
    zIndex: 150,
    pointerEvents: activeSection === 'company' ? 'auto' : 'none',
    transition: 'transform 0.6s cubic-bezier(0.86, 0, 0.07, 1)',
    transform: activeSection === 'company' 
      ? 'translateY(0)' 
      : `translateY(${direction === 'top' ? '-100%' : '100%'})`,
    top: direction === 'top' ? 0 : '50vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottom: direction === 'top' ? '1px solid #333' : 'none',
    borderTop: direction === 'bottom' ? '1px solid #333' : 'none',
  });

  // PROJECTS (Slice)
  const projectStripStyle = (index) => ({
    position: 'fixed',
    top: 0,
    width: '25vw',
    height: '100vh',
    left: `${index * 25}vw`,
    backgroundColor: index % 2 === 0 ? '#111' : '#1a1a1a',
    zIndex: 150,
    pointerEvents: 'none',
    transition: `transform 0.6s cubic-bezier(0.77, 0, 0.175, 1) ${index * 0.1}s`,
    transform: activeSection === 'projects' 
      ? 'translateY(0)' 
      : `translateY(${index % 2 === 0 ? '-100%' : '100%'})`,
  });

  const projectsContentStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 160,
    pointerEvents: activeSection === 'projects' ? 'auto' : 'none',
    opacity: activeSection === 'projects' ? 1 : 0,
    transition: 'opacity 0.5s ease 0.8s',
    overflowY: 'auto',
    padding: '40px 20px 100px 20px', // Extra padding bottom for floating button
    color: 'white',
    fontFamily: 'monospace',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  // Helper to render the floating close button for active sections
  const renderFloatingClose = (label, isWhiteBackground = false) => {
    if (!activeSection) return null;
    
    // Override colors if on white background
    const style = isWhiteBackground 
        ? { ...floatingCloseButtonStyle, background: '#fff', color: '#000', borderColor: '#000' }
        : floatingCloseButtonStyle;

    return (
        <div style={floatingCloseContainerStyle}>
            <button 
                style={style} 
                onClick={handleClose}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
                {label}
            </button>
        </div>
    );
  };

  return (
    <>
      <div style={overlayContainerStyle}>
        <div style={buttonGroupStyle}>
          <button 
            style={buttonStyle(activeSection === 'profile')}
            onClick={() => setActiveSection('profile')}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            PROFILE
          </button>
          <button 
            style={buttonStyle(activeSection === 'company')}
            onClick={() => setActiveSection('company')}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            COMPANY
          </button>
          <button 
            style={buttonStyle(activeSection === 'projects')}
            onClick={() => setActiveSection('projects')}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            PROJECTS
          </button>
        </div>
      </div>

      {/* --- PROFILE --- */}
      <div style={profileModalStyle}>
        <div style={{ maxWidth: '800px', width: '100%', fontFamily: 'monospace' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>CURRICULUM VITAE</h1>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Rasmus Juul Jørgensen</h2>
          <p style={{ marginBottom: '2rem' }}>Bygningskonstruktør, BIM Manager, Owner</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', marginBottom: '3rem' }}>
            <div><strong>CONTACT</strong></div>
            <div>
              E-mail: rasmus.juuljorgensen@gmail.com<br/>
              Mobile: 61 76 45 15
            </div>
          </div>

          <h3 style={{ borderBottom: '1px solid black', paddingBottom: '5px', marginBottom: '15px' }}>EDUCATION</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '1rem', marginBottom: '2rem' }}>
            <div>2007</div>
            <div>
              <strong>Bygningskonstruktør (KEA) Copenhagen</strong><br/>
              (Bachelor’s in architectural technology and construction management)
            </div>
          </div>

          <h3 style={{ borderBottom: '1px solid black', paddingBottom: '5px', marginBottom: '15px' }}>EMPLOYMENT</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '1rem', marginBottom: '2rem' }}>
            <div>Current</div>
            <div><strong>N3XOE</strong> - Owner & Founder</div>
            
            <div>2021-2026</div>
            <div>Steenbergs Tegnestue ApS</div>

            <div>2019-2021</div>
            <div>Rambøll Sverige AB</div>

            <div>2018-2019</div>
            <div>ARUP AS</div>

            <div>2015-2018</div>
            <div>Rambøll Sverige AB</div>

            <div>2009-2015</div>
            <div>Orbicon A/S</div>

            <div>2008-2009</div>
            <div>Leif Hansen ApS</div>

            <div>2006-2007</div>
            <div>Henning Larsen Tegning Stue, (Intern)</div>
          </div>
          
          <h3 style={{ borderBottom: '1px solid black', paddingBottom: '5px', marginBottom: '15px' }}>SPECIALIZATION</h3>
           <p style={{ marginBottom: '2rem', lineHeight: '1.6' }}>
            Primary areas of expertise include the projection of 3D construction models and 2D technical drawings, 
            project coordination, collision detection, and specialist supervision.
          </p>

          <h3 style={{ borderBottom: '1px solid black', paddingBottom: '5px', marginBottom: '15px' }}>SELECTED REFERENCES</h3>
           
           <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ textDecoration: 'underline', marginBottom: '10px' }}>STEENBERG</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '15px' }}>
                    <strong>2025: NEXØ REDNINGSSTATION</strong> - Extension & Renovation. Bornholm. Design & 3D modeling.
                </li>
                <li style={{ marginBottom: '15px' }}>
                    <strong>2024: ALLINGE BØRNEHUS</strong> - Renovation. Bornholm. Integrated daycare. Design coordination & 3D modeling.
                </li>
                <li style={{ marginBottom: '15px' }}>
                    <strong>2024: NOVO NORDISK A/S (IFP HI MFX)</strong> - Hillerød. Gatehouses & courtyard layout. Design coordination & 3D modeling.
                </li>
                 <li style={{ marginBottom: '15px' }}>
                    <strong>2023: IRD – NEW CLEANROOM</strong> - Odense. Cleanroom & office facilities. 3D modeling.
                </li>
            </ul>
           </div>

           <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ textDecoration: 'underline', marginBottom: '10px' }}>RAMBØLL</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '15px' }}>
                    <strong>2021: MALMØ HOSPITAL</strong> - Sweden. New hospital & total renovation. BIM Coordination, 3D from point-clouds.
                </li>
                 <li style={{ marginBottom: '15px' }}>
                    <strong>2020: TESLA GIGAFACTORY</strong> - Berlin. New car factory. Modeling, BIM Coordination, collision detection.
                </li>
            </ul>
           </div>
        </div>
        {activeSection === 'profile' && renderFloatingClose('CLOSE PROFILE', true)}
      </div>

      {/* --- COMPANY --- */}
      <div style={companyPanelStyle('top')}>
        <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '4rem', letterSpacing: '10px', marginBottom: '0' }}>N3XOE</h1>
            <p style={{ fontSize: '1.2rem', letterSpacing: '3px', color: '#888' }}>IOT &bull; BIM &bull; REVIT &bull; SPECIALIST</p>
        </div>
      </div>
      <div style={companyPanelStyle('bottom')}>
        <div style={{ display: 'flex', width: '100%', maxWidth: '1000px', justifyContent: 'space-between', padding: '0 20px', fontFamily: 'monospace' }}>
            <div style={{ width: '45%' }}>
                <h3 style={{ borderBottom: '1px solid white', paddingBottom: '10px', marginBottom: '15px' }}>DIGITAL EXPERTISE</h3>
                <ul style={{ listStyle: 'none', padding: 0, lineHeight: '2' }}>
                    <li>&gt; Advanced BIM Management</li>
                    <li>&gt; Revit Architecture & Structure</li>
                    <li>&gt; IoT Integration in Construction</li>
                    <li>&gt; Digital Twin Development</li>
                    <li>&gt; 3D Laser Scanning & Point Clouds</li>
                </ul>
            </div>
             <div style={{ width: '45%' }}>
                <h3 style={{ borderBottom: '1px solid white', paddingBottom: '10px', marginBottom: '15px' }}>CONSTRUCTION SERVICES</h3>
                <ul style={{ listStyle: 'none', padding: 0, lineHeight: '2' }}>
                    <li>&gt; Construction Consultancy</li>
                    <li>&gt; Technical Supervision (Tilsyn)</li>
                    <li>&gt; Building Permits (Byggetilladelser)</li>
                    <li>&gt; Design Coordination</li>
                    <li>&gt; Project Management</li>
                </ul>
            </div>
        </div>
        <p style={{ marginTop: '30px', maxWidth: '600px', textAlign: 'center', lineHeight: '1.5', color: '#aaa' }}>
            Bridging the gap between traditional craftsmanship and the digital future of construction. 
            Providing specialized consultancy for complex architectural and engineering challenges.
        </p>
        {activeSection === 'company' && renderFloatingClose('CLOSE COMPANY', false)}
      </div>

      {/* --- PROJECTS --- */}
      {[0, 1, 2, 3].map((i) => (
        <div key={i} style={projectStripStyle(i)} />
      ))}
      
      <div style={projectsContentStyle}>
        <h1 style={{ fontSize: '3rem', letterSpacing: '5px', marginBottom: '4rem', borderBottom: '2px solid white', paddingBottom: '10px' }}>SELECTED PROJECTS</h1>
        
        {projectsData.map((project) => (
           <ProjectGallery key={project.id} project={project} />
        ))}

        {activeSection === 'projects' && renderFloatingClose('CLOSE PROJECTS', false)}
      </div>
    </>
  );
};
