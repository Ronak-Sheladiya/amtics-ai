import React from 'react';
import { Building, GraduationCap } from 'lucide-react';

export const InstituteInfo = () => {
  return (
    <section className="institute-info">
      <div className="container">
        <div className="institute-content">
          <div className="institute-item">
            <Building size={20} />
            <span>Department of Computer Science and Technology</span>
          </div>
          <div className="institute-item">
            <GraduationCap size={20} />
            <span>Asha M. Tarsadia Institute of Computer Science and Technology</span>
          </div>
        </div>
      </div>
    </section>
  );
};
