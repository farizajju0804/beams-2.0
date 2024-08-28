import React from 'react';

interface TermsSection {
  type: 'header' | 'subheader' | 'paragraph' | 'list';
  content?: string;
  items?: Array<{ term: string; definition: string }>;
}

const termsOfServiceData: TermsSection[] = [
  {
    type: 'header',
    content: 'Terms of Service'
  },
  {
    type: 'paragraph',
    content: 'Last updated on: August 28, 2024.'
  },
  {
    type: 'paragraph',
    content: 'THIS IS AN AGREEMENT BETWEEN YOU OR THE ENTITY THAT YOU REPRESENT (HEREINAFTER "YOU" or "YOUR") AND BEAMS WORLD (HEREINAFTER "BEAMS") GOVERNING YOUR USE OF BEAMS SUITE OF ONLINE EDUCATIONAL SOFTWARE.'
  },
  {
    type: 'subheader',
    content: '1. Acceptance of the Agreement'
  },
  {
    type: 'paragraph',
    content: 'You must be of legal age to enter into a binding agreement in order to accept the Agreement. If you do not agree to the General Terms, do not use any of our Services. You can accept the Agreement by checking a checkbox or clicking on a button indicating your acceptance of the Agreement or by actually using the Services.'
  },
  {
    type: 'subheader',
    content: '2. Description of Service'
  },
  {
    type: 'paragraph',
    content: 'We provide an educational platform through cloud software and applications("Service" or "Services"). You may use the Services for your personal and educational use. You may connect to the Services using any Internet browser supported by the Services.'
  },
  {
    type: 'subheader',
    content: '3. User Sign up Obligations'
  },
  {
    type: 'paragraph',
    content: 'You need to sign up for a user account by providing all required information in order to access or use the Services. You agree to: (i) provide true, accurate, current and complete information about yourself as prompted by the sign up process; and (ii) maintain and promptly update the information provided during sign up to keep it true, accurate, current, and complete.'
  },
  {
    type: 'subheader',
    content: '4. Restrictions on Use'
  },
  {
    type: 'paragraph',
    content: 'In addition to all other terms and conditions of this Agreement, you shall not:'
  },
  {
    type: 'list',
    items: [
      {
        term: 'Transfer',
        definition: 'Transfer the Services or otherwise make it available to any third party.'
      },
      {
        term: 'Reverse Engineer',
        definition: 'Attempt to reverse engineer, decompile, or disassemble the Services.'
      },
      {
        term: 'Harm',
        definition: 'Use the Services in any manner that could damage, disable, overburden, impair or harm any server, network, computer system, resource of Beams.'
      },
      {
        term: 'Violate Laws',
        definition: 'Use the Services to violate any applicable local, state, national or international law.'
      }
    ]
  },
  {
    type: 'subheader',
    content: '5. Intellectual Property Rights'
  },
  {
    type: 'paragraph',
    content: 'The Services and their entire contents, features, and functionality (including but not limited to all information, software, text, displays, images, video, and audio, and the design, selection, and arrangement thereof) are owned by Beams, its licensors, or other providers of such material and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.'
  },
  {
    type: 'subheader',
    content: '6. Termination'
  },
  {
    type: 'paragraph',
    content: 'We may terminate your access to the Services, without cause or notice, which may result in the forfeiture and destruction of all information associated with your account. All provisions of this Agreement that by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.'
  },
  // {
  //   type: 'subheader',
  //   content: '7. Disclaimer of Warranties'
  // },
  // {
  //   type: 'paragraph',
  //   content: 'THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.'
  // },
  // {
  //   type: 'subheader',
  //   content: '8. Limitation of Liability'
  // },
  // {
  //   type: 'paragraph',
  //   content: 'IN NO EVENT SHALL BEAMS, ITS OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS, BE LIABLE TO YOU FOR ANY INDIRECT, INCIDENTAL, SPECIAL, PUNITIVE, OR CONSEQUENTIAL DAMAGES WHATSOEVER RESULTING FROM ANY (I) ERRORS, MISTAKES, OR INACCURACIES OF CONTENT, (II) PERSONAL INJURY OR PROPERTY DAMAGE, OF ANY NATURE WHATSOEVER, RESULTING FROM YOUR ACCESS TO AND USE OF OUR SERVICES, (III) ANY UNAUTHORIZED ACCESS TO OR USE OF OUR SECURE SERVERS AND/OR ANY AND ALL PERSONAL INFORMATION AND/OR FINANCIAL INFORMATION STORED THEREIN.'
  // },
  {
    type: 'subheader',
    content: '7. Governing Law'
  },
  {
    type: 'paragraph',
    content: 'These Terms shall be governed and construed in accordance with the laws of [Your Country/State], without regard to its conflict of law provisions.'
  },
  {
    type: 'subheader',
    content: '8. Changes to Terms'
  },
  {
    type: 'paragraph',
    content: 'We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.'
  },
  {
    type: 'subheader',
    content: '9. Contact Us'
  },
  {
    type: 'paragraph',
    content: 'If you have any questions about these Terms, please contact us at info@beams.world.'
  }
];

const TermsOfServicePage: React.FC = () => {
  const renderContent = (item: TermsSection) => {
    switch (item.type) {
      case 'header':
        return <h1 className="text-3xl md:text-4xl font-poppins font-bold text-center text-text mb-6">{item.content}</h1>;
      case 'subheader':
        return <h2 className="text-xl md:text-2xl font-poppins font-semibold text-text mt-8 mb-4">{item.content}</h2>;
      case 'paragraph':
        return (
          <p className="text-grey-2 leading-relaxed mb-4">
            {item.content?.split(' ').map((word, index) => {
              if (word.startsWith('www.') || word.startsWith('http')) {
                return <a key={index} href={word.startsWith('www.') ? `https://${word}` : word} target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">{word} </a>;
              } else if (word.includes('@')) {
                return <a key={index} href={`mailto:${word}`} className="text-brand hover:underline">{word} </a>;
              }
              return `${word} `;
            })}
          </p>
        );
      case 'list':
        return (
          <ul className="list-disc list-inside mb-4">
            {item.items?.map((listItem, index) => (
              <li key={index} className="mb-2">
                <strong className="font-semibold">{listItem.term}:</strong> {listItem.definition}
              </li>
            ))}
          </ul>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {termsOfServiceData.map((item, index) => (
          <React.Fragment key={index}>
            {renderContent(item)}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default TermsOfServicePage;