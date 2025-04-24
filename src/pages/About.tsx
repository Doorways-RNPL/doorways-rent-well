
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-32">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">About Doorways RNPL</h1>
          <p className="text-lg text-gray-600 mb-8">
            At Doorways RNPL, we're on a mission to revolutionize the rental housing market by making it more accessible, 
            equitable, and beneficial for all stakeholders involved.
          </p>
          <p className="text-lg text-gray-600 mb-8">
            Our Rent Now, Pay Later solution was built to address a critical gap in the housing market - the high upfront 
            costs that prevent many qualified individuals and families from securing the housing they need and deserve.
          </p>
          <p className="text-lg text-gray-600 mb-8">
            Founded by a team of housing experts, financial specialists, and technology innovators, Doorways RNPL brings 
            together deep industry knowledge with cutting-edge technology to create a platform that truly works for everyone.
          </p>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-12">Our Vision</h2>
          <p className="text-lg text-gray-600 mb-8">
            We envision a world where housing is accessible to all qualified individuals, regardless of their ability to 
            pay large sums upfront. Where landlords can confidently rent to a wider pool of tenants without increasing their 
            risk. Where the entire rental ecosystem is more efficient, transparent, and beneficial for all parties involved.
          </p>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-12">Our Values</h2>
          <ul className="list-disc pl-6 text-lg text-gray-600 space-y-3 mb-8">
            <li><span className="font-semibold">Accessibility</span> - Making quality housing available to more people</li>
            <li><span className="font-semibold">Transparency</span> - Clear, honest communication in all our dealings</li>
            <li><span className="font-semibold">Innovation</span> - Continuously improving our solutions</li>
            <li><span className="font-semibold">Reliability</span> - Being a trustworthy partner for all stakeholders</li>
            <li><span className="font-semibold">Empathy</span> - Understanding and addressing the needs of our users</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
