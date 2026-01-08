import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Award, Users, Package, Filter } from "lucide-react";

const PortfolioContent = () => {
  const [filter, setFilter] = useState("All");

  const categories = ["All", "Fine Dining", "Casual Dining", "Cafe", "Fast Food"];

  const projects = [
    {
      id: 1,
      title: "The Grand Dining Room",
      category: "Fine Dining",
      image:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      description:
        "An opulent fine-dining experience featuring a world-class wine cellar and gourmet tasting menus.",
    },
    {
      id: 2,
      title: "Rustic Steakhouse & Grill",
      category: "Casual Dining",
      image:
        "https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      description:
        "Hearty, wood-fired steaks and grilled specialties in a warm, welcoming atmosphere.",
    },
    {
      id: 3,
      title: "Azure Seafood Lounge",
      category: "Fine Dining",
      image:
        "https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      description:
        "Fresh, sustainably sourced seafood served with a modern twist and stunning waterfront views.",
    },
    {
      id: 4,
      title: "The Daily Grind Cafe",
      category: "Cafe",
      image:
        "https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      description:
        "Artisanal coffee, fresh-baked pastries, and a cozy space for work or relaxation.",
    },
    {
      id: 5,
      title: "Zen Sushi & Sake Bar",
      category: "Casual Dining",
      image:
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      description:
        "Traditional techniques meet modern flavors in our sleek, minimalist sushi lounge.",
    },
    {
      id: 6,
      title: "Swift Bites Express",
      category: "Fast Food",
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      description:
        "High-quality, chef-prepared meals served fast for the busy urban professional.",
    },
  ];

  const filteredProjects =
    filter === "All"
      ? projects
      : projects.filter((project) => project.category === filter);

  const stats = [
    { icon: Award, value: "500+", label: "Events Hosted" },
    { icon: Package, value: "14k+", label: "Deliveries Completed" },
    { icon: Users, value: "99%", label: "Client Satisfaction" },
    { icon: Star, value: "4.8", label: "Average Rating" },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Event Planner",
      text:
        "Dosta transformed our event with their impeccable catering and service. Highly recommended!",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
    },
    {
      name: "Michael Chen",
      role: "Logistics Manager",
      text:
        "The efficiency and reliability of their delivery network are unmatched. A true partner in growth.",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
    },
    {
      name: "Emily Davis",
      role: "Bride",
      text:
        "Our wedding food was the talk of the night. Thank you Dosta for making our special day perfect!",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
    },
    {
      name: "James Wilson",
      role: "Restaurant Critic",
      text:
        "The attention to detail at Zen Sushi Lounge is remarkable. A true gem in the city's culinary scene.",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
    },
  ];

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative bg-primary-dark text-white py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('/images/nav/dosta_blue.svg')] bg-repeat space-x-4"></div>
        <div className="main-container relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Our Work Speaks <br />
            <span className="">For Itself</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10">
            Explore our portfolio of successful projects, from grand events to
            optimized delivery solutions. We take pride in every partnership.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white -mt-10 relative z-20">
        <div className="main-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 bg-white rounded-2xl hover:shadow-xl transition-all duration-300 p-8 border border-gray-100">
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center text-primary mb-4">
                  <stat.icon size={24} />
                </div>
                <h3 className="text-3xl font-bold text-neutral-black mb-1">
                  {stat.value}
                </h3>
                <p className="text-neutral-gray-dark text-sm font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-20 bg-neutral-gray-lightest">
        <div className="main-container">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
            <div>
              <h2 className="text-3xl font-bold text-neutral-black mb-2">
                Featured Projects
              </h2>
              <p className="text-neutral-gray-dark">
                A glimpse into our diverse range of services.
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${filter === cat
                    ? "bg-primary text-white shadow-md"
                    : "bg-white text-neutral-gray-dark hover:bg-gray-100"
                    }`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 bg-white text-primary font-bold py-2 px-6 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      View Details
                    </span>
                  </div>
                  <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    {project.category}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-neutral-black mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-neutral-gray-dark text-sm leading-relaxed">
                    {project.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="main-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-neutral-black mb-4">
              Client Satisfaction
            </h2>
            <p className="text-neutral-gray-dark max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our valued clients have to
              say about their experience with Dosta.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-neutral-gray-lightest rounded-2xl p-8 relative">
                <div className="absolute -top-6 left-8">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full border-4 border-white shadow-md object-cover object-top"
                  />
                </div>
                <div className="mt-6">
                  <div className="flex text-yellow-400 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-neutral-gray-dark italic mb-6">
                    "{testimonial.text}"
                  </p>
                  <div>
                    <h4 className="font-bold text-neutral-black">{testimonial.name}</h4>
                    <p className="text-sm text-primary">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-primary-3d rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-secondary rounded-full opacity-20 blur-3xl"></div>

        <div className="main-container relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Project?
          </h2>
          <p className="text-primary-light text-lg mb-10 max-w-2xl mx-auto">
            Let us help you bring your vision to life with our premium services.
          </p>
          <Link
            to="/contact-us"
            className="inline-block bg-white text-primary font-bold py-4 px-10 rounded-full hover:bg-gray-100 transition-colors shadow-lg transform hover:scale-105">
            Contact Us Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default PortfolioContent;
