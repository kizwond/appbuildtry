const SectionWrapper = ({ title, content }) => (
  <section className="w-full p-2 bg-white rounded">
    <div className="ForMobilePageMainTitle">{title}</div>
    <div className="px-[4px]">{content}</div>
  </section>
);

export default SectionWrapper;
