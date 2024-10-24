import React from 'react';

const privacyPolicyData = [
  {
    type: 'header',
    content: 'Privacy Policy'
  },
  {
    type: 'paragraph',
    content: 'Your privacy is important to us. Beams World ("Beams World" or "we") takes the privacy of your information seriously. This privacy statement explains what personal data we collect from you, through our interactions with you on this website, and how we use that data.'
  },
  {
    type: 'paragraph',
    content: 'This privacy statement applies to the main website www.beams.world as well as any sub-domains. Please note that these websites may include links to websites of third parties whose privacy practices differ from those of Beams World. If you provide personal data to any of those websites, then your data is governed by their privacy statements.'
  },
  {
    type: 'subheader',
    content: '1. Definitions'
  },
  {
    type: 'paragraph',
    content: 'In this privacy policy, the following definitions are used:'
  },
  {
    type: 'list',
    items: [
      { 
        term: 'Data',
        definition: 'includes information that you submit to Beams World via the Website, and information which is accessed by Beams World pursuant to your visit to the Website.'
      },
      {
        term: 'Cookies',
        definition: 'a small file placed on your computer by this Website when you either visit, or use certain features of, the Website. A cookie generally allows the website to "remember" your actions or preference for a certain period of time.'
      },
    //   {
    //     term: 'Data Protection Laws',
    //     definition: 'any applicable law relating to the processing of personal Data, including the GDPR and relevant national laws.'
    //   },
    //   {
    //     term: 'GDPR',
    //     definition: 'the General Data Protection Regulation (EU) 2016/679.'
    //   },
    //   {
    //     term: 'Beams World, us, or we',
    //     definition: 'Beams World, an educational platform registered in [INSERT REGISTRATION DETAILS].'
    //   },
      {
        term: 'User or you',
        definition: 'the natural person who accesses the Website.'
      },
      {
        term: 'Website',
        definition: 'the website that you are currently using, www.beams.world and any sub-domains of this site, unless excluded by their own terms.'
      }
    ]
  },
  {
    type: 'subheader',
    content: '2. Scope'
  },
  {
    type: 'paragraph',
    content: 'Beams World collects data to operate this educational website. You provide some of this data directly, such as when you create an account, enroll in a course, or contact us for support.'
  },
  {
    type: 'paragraph',
    content: 'You can visit www.beams.world without telling us who you are. You can make choices about our collection and use of your data. For example, you may want to access, edit or remove the personal information in your Beams World account.'
  },
  {
    type: 'subheader',
    content: '3. Data Collected'
  },
  {
    type: 'paragraph',
    content: 'We may collect information or pieces of information that could allow you to be identified, including:'
  },
  {
    type: 'list',
    items: [
      {
        term: 'Contact information',
        definition: 'We collect first and last name, email address, country, and other similar contact data.'
      },
      {
        term: 'User profile',
        definition: 'We collect information such as your educational background, profile picture, interests, and others.'
      },
      {
        term: 'Usage data',
        definition: 'We collect data about your interactions with our website and services, including courses accessed, progress in courses, and assessment results.'
      }
    ]
  },
  {
    type: 'subheader',
    content: '4. How we Collect Data'
  },
  {
    type: 'paragraph',
    content: 'We collect Data in the following ways:'
  },
  {
    type: 'list',
    items: [
      {
        term: 'Data given by you',
        definition: 'Information you provide directly to us.'
      },
      {
        term: 'Data collected automatically',
        definition: 'Information collected during your visit to the Website.'
      }
    ]
  },
  {
    type: 'subheader',
    content: '5. Data shared by You'
  },
  {
    type: 'paragraph',
    content: 'Beams World may collect your Data in several ways from your use of this Website. For instance:'
  },
  {
    type: 'list',
    items: [
      {
        term: 'Account creation',
        definition: 'When you create an account or profile on our platform.'
      },
      {
        term: 'Course enrollment',
        definition: 'When you enroll in or interact with our educational content.'
      },
      {
        term: 'Communication',
        definition: 'When you contact us through the Website.'
      },
      {
        term: 'Participation',
        definition: 'When you participate in forums, discussions, or surveys on our platform.'
      },
      {
        term: 'Subscription',
        definition: 'When you elect to receive any communications from us.'
      }
    ]
  },
  {
    type: 'subheader',
    content: '6. Data that is Collected Automatically'
  },
  {
    type: 'list',
    items: [
      {
        term: 'Visit information',
        definition: 'We automatically collect some information about your visit to the Website. This information helps us to make improvements to Website content and navigation.'
      },
      {
        term: 'Technical data',
        definition: 'Our web servers collect information such as your IP address, operating system details, browsing details, device details and language settings.'
      },
      {
        term: 'Cookies',
        definition: 'We may collect your Data automatically via Cookies, in line with the cookie settings on your browser. For more information about Cookies, please see the section below, titled "Cookies".'
      }
    ]
  },
  {
    type: 'subheader',
    content: '7. Our Use of Data'
  },
  {
    type: 'paragraph',
    content: 'We use your data to provide and improve our educational services. Specifically, Data may be used by us for the following reasons:'
  },
  {
    type: 'list',
    items: [
      {
        term: 'Service provision',
        definition: 'To provide, operate, and maintain our educational platform.'
      },
      {
        term: 'Service improvement',
        definition: 'To improve, personalize, and expand our services.'
      },
      {
        term: 'Usage analysis',
        definition: 'To understand and analyze how you use our website.'
      },
      {
        term: 'Product development',
        definition: 'To develop new products, services, features, and functionality.'
      },
      {
        term: 'Communication',
        definition: 'To communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes.'
      },
      {
        term: 'Transaction processing',
        definition: 'To process your transactions.'
      },
      {
        term: 'Fraud prevention',
        definition: 'To find and prevent fraud.'
      },
      {
        term: 'Legal compliance',
        definition: 'For compliance purposes, including enforcing our Terms of Service, or other legal rights, or as may be required by applicable laws and regulations or requested by any judicial process or governmental agency.'
      }
    ]
  },
  {
    type: 'subheader',
    content: '8. Who we share Data with'
  },
//   {
//     type: 'paragraph',
//     content: 'We may share your personal Data with:'
//   },
  {
    type: 'list',
    items: [
    //   {
    //     term: 'Service providers',
    //     definition: 'Who assist us in operating our platform and conducting our business.'
    //   },
    //   {
    //     term: 'Educational partners',
    //     definition: 'Affiliated educational institutions or partners, when necessary for providing our services.'
    //   },
    //   {
    //     term: 'Legal authorities',
    //     definition: 'Legal and regulatory authorities, as required by applicable laws.'
    //   }
    ]
  },
  {
    type: 'paragraph',
    content: 'We do not share or sell your personal data to third parties.'
  },
  {
    type: 'subheader',
    content: '9. Keeping Data secure'
  },
  {
    type: 'paragraph',
    content: 'We use technical and organizational measures to safeguard your Data and we store your Data on secure servers. While we implement safeguards designed to protect your information, no security system is impenetrable and due to the inherent nature of the Internet, we cannot guarantee that data, during transmission through the Internet or while stored on our systems or otherwise in our care, is absolutely safe from intrusion by others.'
  },
  {
    type: 'subheader',
    content: '10. Retention of Personal Data'
  },
  {
    type: 'paragraph',
    content: 'Beams World retains personal Data for as long as necessary to provide our services, or for other essential purposes such as complying with our legal obligations, resolving disputes, and enforcing our agreements. The retention period depends on the type of data and the purpose for which it was collected.'
  },
  {
    type: 'subheader',
    content: '11. Your Rights'
  },
  {
    type: 'paragraph',
    content: 'Under the GDPR and other applicable data protection laws, you have certain rights regarding your personal data, including:'
  },
  {
    type: 'list',
    items: [
      {
        term: 'Access',
        definition: 'The right to access, update or delete the information we have on you.'
      },
      {
        term: 'Rectification',
        definition: 'The right to have your information corrected if it is inaccurate or incomplete.'
      },
      {
        term: 'Objection',
        definition: 'The right to object to our processing of your personal data.'
      },
      {
        term: 'Restriction',
        definition: 'The right to request that we restrict the processing of your personal information.'
      },
      {
        term: 'Data portability',
        definition: 'The right to receive a copy of your personal data in a structured, machine-readable format.'
      },
      {
        term: 'Withdraw consent',
        definition: 'The right to withdraw consent at any time where we rely on your consent to process your personal information.'
      }
    ]
  },
  {
    type: 'paragraph',
    content: 'To exercise these rights, please contact us at contact@beams.world.'
  },
  {
    type: 'subheader',
    content: '12. Cookies'
  },
  {
    type: 'paragraph',
    content: 'This Website uses Cookies to improve your experience of using the Website. By using our website, you agree to our use of cookies as described in this policy.'
  },
  {
    type: 'paragraph',
    content: 'You can choose to enable or disable Cookies in your internet browser. Most internet browsers also enable you to choose whether you wish to disable all cookies or only third-party cookies. By default, most internet browsers accept Cookies, but this can be changed.'
  },
  {
    type: 'subheader',
    content: '13. Changes to this Privacy Policy'
  },
  {
    type: 'paragraph',
    content: 'We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top of this Privacy Policy.'
  },
  {
    type: 'paragraph',
    content: 'You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.'
  },
  {
    type: 'subheader',
    content: '14. Contact Us'
  },
  {
    type: 'paragraph',
    content: 'If you have any questions about this Privacy Policy, please contact us:'
  },
  {
    type: 'list',
    items: [
      {
        term: 'By email',
        definition: 'contact@beams.world'
      },
      {
        term: 'By visiting this page on our website',
        definition: 'www.beams.world/contact-us'
      }
    ]
  },
  {
    type: 'paragraph',
    content: 'Last updated: August, 28, 2024'
  }
];

const PrivacyPolicyPage = () => {
  const renderContent = (item:any) => {
    switch (item.type) {
      case 'header':
        return <h1 className="text-3xl md:text-4xl font-poppins font-bold text-center text-text mb-6">{item.content}</h1>;
      case 'subheader':
        return <h2 className="text-xl md:text-2xl font-poppins font-semibold text-text mt-8 mb-4">{item.content}</h2>;
      case 'paragraph':
        return (
          <p className="text-grey-2 leading-relaxed mb-4">
            {item.content.split(' ').map((word:any, index:any) => {
              if (word.startsWith('www.') || word.startsWith('http')) {
                return <a key={index} href={word.startsWith('www.') ? `https://${word}` : word} target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">{word} </a>;
              } else if (word.includes('@')) {
                return <a key={index} href={`mailto:${word}`} className="text-brand hover:underline">{word}</a>;
              }
              return `${word} `;
            })}
          </p>
        );
      case 'list':
        return (
          <ul className="list-disc list-inside mb-4">
            {item.items.map((listItem:any, index:any) => (
              <li key={index} className="mb-2">
                <strong className="font-semibold">{listItem.term}:</strong> {listItem.definition.split(' ').map((word:any, index:any) => {
              if (word.startsWith('www.') || word.startsWith('http')) {
                return <a key={index} href={word.startsWith('www.') ? `https://${word}` : word} target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">{word} </a>;
              } else if (word.includes('@')) {
                return <a key={index} href={`mailto:${word}`} className="text-brand hover:underline">{word}</a>;
              }
              return `${word} `;
            })}
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
        {privacyPolicyData.map((item, index) => (
          <React.Fragment key={index}>
            {renderContent(item)}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;