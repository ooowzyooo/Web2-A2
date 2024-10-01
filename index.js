const API_URL = `http://localhost:3000`

const links = document.querySelectorAll('#routes a')
const currentPath = window.location.pathname
links.forEach(link => {
  if (link.getAttribute('href').split('/').pop() === currentPath.split('/').pop()) {
    link.classList.add('active')
  }
})

function fetchHtml(data) {
  return `
  	<div class="card w-full fundraiser-card">
      <img src="./img/${data.FUNDRAISER_ID}.jpg" alt="" />
      <div class="card-info">
        <div class="title">${data.CAPTION}</div>
        <div class="name">${data.ORGANIZER}</div>
        <div class="FUNDING">CURRENT_FUNDING：$${data.CURRENT_FUNDING}</div>
        <div class="FUNDING">TARGET_FUNDING：$${data.TARGET_FUNDING}</div>
        <div class="FUNDING">CATEGORY：${data.CATEGORY_NAME}</div>
        <div class="FUNDING" style="display: flex;justify-content: space-between;padding-right:10px">CITY：${data.CITY} <span class="${
    data.ACTIVE === 0 ? 'Over' : ''
  }">${data.ACTIVE === 0 ? 'Over' : 'Underway'}</span></div>
      </div>
    </div>
	`
}

function fetchCategoryHtml(data) {
  return `<option value="${data.CATEGORY_ID}">${data.NAME}</option>`
}

if (currentPath.split('/').pop() === 'index.html') {
  // 获取主页募捐活动
  fetch(`${API_URL}/fundraisers`)
    .then(response => response.json())
    .then(data => {
      const fundraisersElement = document.getElementById('fundraisers')
      for (let index = 0; index < data.length; index++) {
        const element = data[index]
        const html = fetchHtml(element)
        fundraisersElement.insertAdjacentHTML('beforeend', html)
      }
      const doms = document.querySelectorAll('.fundraiser-card')
      doms.forEach((item, index) => {
        item.addEventListener('click', () => navTo('./particulars.html?id=' + data[index].FUNDRAISER_ID))
      })
    })
}

function fetchParticularsHtml(data) {
  return `
		<div class="image-card">
          <img src="./img/${data.FUNDRAISER_ID}.jpg" alt="" />
          <div class="info">
            <div class="Have"><span>£100,000</span></div>
            <div class="Target">Target financing <span>£100,000</span></div>
			<div class="button mt-32px" style="padding-left:32px;padding-right:32px" onClick="alert('This feature is under contruction')">Donate</div>
          </div>
        </div>
        <h1 class="name" style="display: flex;justify-content: space-between;padding-right:10px">${data.CAPTION} <span class="${
    data.ACTIVE === 0 ? 'Over' : ''
  }">${data.ACTIVE === 0 ? 'Over' : 'Underway'}</span></h1>
        <h2 class="name">${data.ORGANIZER}</h2>
        <h3 class="address">${data.CITY}</h3>
        <h6 class="category">${data.CATEGORY_NAME}</span></h6>
		<div class="">
          <h2>Story</h2>
  ${getParticulars(data.FUNDRAISER_ID).text}
        </div>
	  `
}

const navTo = url => {
  window.location.href = url
}

const getSearch = () => {
  const category = document.getElementById('category').value
  const city = document.getElementById('city').value
  const organizer = document.getElementById('organizer').value

  const params = new URLSearchParams({ category, city, organizer })
  fetch(`${API_URL}/search?${params}`)
    .then(response => response.json())
    .then(data => {
      const fundraisersElement = document.getElementById('fundraisers')
      fundraisersElement.innerHTML = ``
      if (!data || data.length === 0) {
        fundraisersElement.innerHTML = `<div></div><div class="Nothing">Nothing was found!</div><div></div>`
        return
      }
      data.forEach(item => {
        const html = fetchHtml(item)
        fundraisersElement.insertAdjacentHTML('beforeend', html)
      })
      const doms = document.querySelectorAll('.fundraiser-card')
      doms.forEach((item, index) => {
        item.addEventListener('click', () => navTo('./particulars.html?id=' + data[index].FUNDRAISER_ID))
      })
    })
}

document.getElementById('submit')?.addEventListener('click', getSearch)
document.getElementById('clear')?.addEventListener('click', clearChechboxes)

if (currentPath.split('/').pop() === 'fund-raising.html') {
  fetch(`${API_URL}/categories`)
    .then(response => response.json())
    .then(data => {
      const categoryElement = document.getElementById('category') // 使用不同的变量名
      for (let index = 0; index < data.length; index++) {
        const element = data[index]
        const html = fetchCategoryHtml(element)
        categoryElement.insertAdjacentHTML('beforeend', html)
      }
      getSearch()
    })
}

const queryString = window.location.search
const params = new URLSearchParams(queryString)
if (params.get('id')) {
  fetch(`${API_URL}/fundraiser/` + params.get('id'))
    .then(response => response.json())
    .then(data => {
      const categoryElement = document.getElementById('details')
      const html = fetchParticularsHtml(data)
      categoryElement.insertAdjacentHTML('beforeend', html)
    })
}

function clearChechboxes() {
  document.getElementById('category').value = ''
  document.getElementById('city').value = ''
  document.getElementById('organizer').value = ''
  getSearch()
}

function getParticulars(id) {
  return {
    0: {
      text: `<h5>We are The Sameer Project (@TheSameerProject): A donations based aid initiative, led by four Palestinians in the diaspora, working to supply an emergency reponse and funding to the displaced families in Gaza.</h5>
<h5>The “Sameer Abu Salim Tent Initiative” (named after one of our team member’s martyred father) was formed to secure, purchase, and distribute tents in Southern Gaza.</h5>
<h5>The Sameer Project also supplies cash envelops on an “as needed” basis to allow families the independence to secure the specific aid they require for themselves.</h5>
<h5>We also support critical medical cases with treatment, medication, and clinic referrals to those who would otherwise not be able to afford medical intervention. Life saving medication, tests, scans, and doctor visits are out of reach monetarily for most all Gazans as the closed borders have created extreme scarcity and the number of injures and chrioically sick grow, putting a nearly insurmountable strain on the healthcase infrastructure. </h5>
<h5>The vast majority of Gaza Strip has been bombed and destroyed which has lead to the death of over 41,000 people (including 16,500 children) and the displacement of around 2 million people.</h5>
<h5>Most of the populatio now residing in southern and central Gaza are sheltering in tents. However, the quality of these tents varies and the high-quality, portable and reusable tents (Emirati & Qatari), that were originally intended to be given out for free, end up on the secondary market sold for $700 - $1,000 a tent. This is due to war profiteering and people capitalizing on the desperation of people in Gaza. The benefits of purchasing these particular tents are listed below.</h5>
<h5>We have been securing tents for the last six months and managed, through your donations, to purchase 900+ units and deliver them to families in need. Our list has upwards of 6,500 families, so we need your help to purchase and distribute more! We work with an incredible team on the ground to source, purchase, store, and distribute to families, FOR FREE, many of whom are currently without any type of shelter.</h5>
<h5>With your donation we can provide a degree of safety, shelter, and dignity for these families who are in desperate need of assistance.</h5>`,
    },
    1: {
      text: `<h5>Translating Falasteen (Palestine), in collaboration with The Sameer Project, launched a fundraising campaign to support families in Gaza facing severe hardships. Our mission is to provide essential aid to those who need it most, especially families with specific and urgent needs. The aid is bought from existing products in the market and is NOT being brought in through any border.</h5>

<h5>SUPPORT NEEDED: 27002.48 GBP USED UP ALREADY - Only around 5000 GBP left - barely enough for one week! (Last updated 27.09.2024)</h5>

<h5>(Scroll down for the daily updates in the Comments section)</h5>

<h5>Since the start of our work in mid June 2024, including the work on this campaign, we have achieved the following (last updated September 26th 2024):</h5>

<h5>1,089,000 liters of fresh and tested water provided for north Gaza (Test took place on 08.08.2024 - please check that reel @translating_falasteen on IG)

67 community kitchens organized and 7503 families fed with our community kitchens (since mid June)

868 children and adults treated in 6 Free Medical Treatment Days organized in North Gaza

Around 30,000 USD given in cash aid</h5>

<h5>2330 packs of diapers and 629 tins of baby formula distributed in displacement schools, camps, and to select families in need.
+ other activities such as Eid campaigns, food packages, miscellaneous initiatives (all mentioned below)</h5>

<h5>Our focus currently has been on the north of Gaza, due to the lack of humanitarian aid efforts there and the starvation that part of the Strip is going through.</h5>

<h5>We are currently providing community kitchens and/or water trucks EVERY SINGLE DAY in the north of Gaza!</h5>


`,
    },
    2: {
      text: `<h5>My name is Steven Donziger. I’m a human rights lawyer who was locked up in the United States for close to three years after I worked with Amazonian communities to hold Chevron to account for creating one of the world’s worst environmental disasters.</h5>


<p>For three decades, Chevron dumped billions of gallons of cancer-causing oil waste into the rivers and streams of the Amazon Rainforest in Ecuador.</p> 


<p>This produced a devastating environmental catastrophe that resulted in the deaths of thousands of Indigenous peoples and farmers. Even today, Indigenous communities continue to face imminent risk of death due to exposure to Chevron’s toxic waste.</p>


<p>After years of litigation, we won a landmark legal battle that resulted in Chevron being ordered to pay $10bn in damages – the largest judgement ever awarded in an environmental lawsuit.</p>


<h5>But they haven’t yet paid out one cent.</h5>`,
    },
    3: {
      text: `
        <h5>Kindly Animal Sanctuary is run by a mother Naomi, and daughter Trinity (and little granddaughter Seraphina) who work day and night to save Maremmas and other animals. We have very little support and very little funding. It isn't an easy task, and the physical aspect is only one of the high demands. It is emotionally exhausting. When most people close their eyes or turn off the news when they see something horrific involving animals, we have to be there, eyes wide open, despite how late it is, how cold it is, or how tired we are.</h5>

<h5>Donations over $2 are 100% tax deductible!</h5>

<h5>Every year countless Maremmas find themselves in awful, inhumane situations, and there aren't many rescues equipped to rescue them longterm. </h5>

<h5>We urgently require donations to save these innocent dogs who will otherwise be killed.</h5>

<h5>Maremmas are livestock guardian dogs. They're very different to other dogs and people buy them, then panic and dump them when they realise Maremmas aren't house pets. There is currently a massive issue with Maremmas who have been bred for high profits, sold to anyone and then dumped in terrible conditions where this poor, misunderstood breed very often gets euthanised.</h5>

<h5>The two of us recently rescued 18 Maremmas just from 1 property where they were to be shot rather than desexed. We set off on another journey where we saved 8 Maremmas who were only young, due to be euthanised if we didn't show up.</h5>

<h5>We need to build more shelters, and paddocks in order to save more Maremmas.</h5>

<h5>Kindly rescues Maremmas off death row. But we can't keep rescuing them until we get more funding. If we say no, they die.</h5>

<h5>Kindly Animal Sanctuary is a 350 acre Not For Profit charity with DGR1 status.</h5>

<h5>Kindly currently has more Maremmas than ever before. With dozens needing to seek refuge with Kindly, and us struggling with funding, and lack of infrastructure, we cannot keep rescuing the Maremmas who need us. </h5>
      `,
    },
    4: {
      text: `
      <h5>As of late January 2024, LoP Rescue has 20 animals in foster care, of the twenty, 8 are extremely high medical needs.</h5>

<h5>We have made the tough decision to completely halt and abandon all our plans and hopes of raising the $85,000 we originally estimated was needed to reopen Life of Pikelet Rescue to new intakes.</h5>

<h5>It's clear it's just not going to happen for us. We do not know when or if Life of Pikelet Rescue will reopen, we are waiting to see if we will get approved for some Victorian Government funding (we applied for this back in Nov 2023).</h5>

<h5>For now, it's clear that we need to continue to aim for the $85,000 goal but use that money solely for the 8 special needs puppies we need specialist medical care for and the 12 remaining healthy puppies who need all their vetting done before adoption.</h5>

<h5>We have over $3500 worth of outstanding food bills. The food for the current dogs in care at Life of Pikelet HQ (25 dogs in total) is at about $1100 a week... we are not able to continue to add to this bill, not pay, and feed these dogs.</h5>

<h5>The description below for the orginal goal of this fund will remain published, it's important to be transparent with our supporters in what the original purpose of this "last" fundraiser was intended and what it will now be covering.</h5>

<h5>For two examples of our current urgent finanical needs, we have french bull dog puppy, Primrose Oil still (at this time) in the emergency care of Greencross Vet Werribee. She is in the intensive care unit of the emergency department. Her current bill (that is growing by the day) has surpassed $9000, this includes CT scans and consulting from Animal Eye Care specialist. We predict a further $3000 is needed for her possible discharge on Monday the 28th of Jan. So far $1750 has been raised, leaving the outstanding $9000 and climbing each minute she stays in intesive care.</h5>

<h5>We also have Parmy, a british bulldog pup with spina bifida who has undergone surgeries for her back legs. On top of spina bifida, Parmy has "straight leg syndrome" and may need a leg amputation. Her current bill at Delehay Vet stands at over $3500 and growing. She will need to see a surgical specialist. We estimate a possible further $7-11K of future vet bills.</h5>

<h5>Just these two dogs alone, it's over $20,000 of vet bills.</h5>

<h5>Specialist medically compromised, congentital birth defect or differently abled animal rescue is not a common practice in Australia, we are one of a very limited animal rescues who focus on such. </h5>`,
    },
  }[id - 1]
}
