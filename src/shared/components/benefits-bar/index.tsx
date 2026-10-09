import React from 'react'
import { FaDove, FaGift, FaHeart } from 'react-icons/fa'

const BenefitsBar = () => {
  const features = [
    {
      label: "Gifts for every occasion",
      icon: <FaGift />,
      description: "Shop for gifts that celebrate life's special moments—birthdays, anniversaries, holidays, and more."
    },
    {
      label: "Faith-inspired essentials",
      icon: <FaDove />,
      description: "Discover meaningful Catholic gifts that inspire faith and bring blessings to everyday life."
    },
    {
      label: "Thoughtfully selected",
      icon: <FaHeart />,
      description: "Each item is thoughtfully selected to bring beauty and meaning to your faith journey."
    },
  ]
  return (
    <section aria-label="Why shop with us"
      className="w-full">
           <div className="mx-auto grid max-w-7xl grid-cols-1 px-6 py-6 md:grid-cols-3 md:px-8 md:py-10">

      {
        features.map((feature, index) => (
          <div key={feature.label} className={`flex items-center justify-center gap-5 py-5 md:px-6 md:py-0 ${
            index > 0
              ? "border-t border-[#D9C8AB] md:border-l md:border-t-0"
              : ""
          }`}>
            {feature.icon}
            <h3>{feature.label}</h3>

          </div>
        ))
      }
           </div>
    </section>
  )
}

export default BenefitsBar