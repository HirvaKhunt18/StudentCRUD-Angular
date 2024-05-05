using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentCrudAPI.Models;

namespace StudentCrudAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentAPIController : ControllerBase
    {
        private readonly StudentDbContext _studnetDbontext;
        public StudentAPIController(StudentDbContext studentDbContext)
        {
            _studnetDbontext = studentDbContext;
        }

        [HttpGet]
        [Route("FetchAllStudents")]
        public IActionResult FetchAllStudents()
        {
            try
            {
                var students = _studnetDbontext.Student
                    .Join(
                        _studnetDbontext.City,
                        student => student.CityId,
                        city => city.CityId,
                        (student, city) => new { Student = student, City = city }
                    )
                    .Join(
                        _studnetDbontext.State,
                        combined => combined.City.StateId,
                        state => state.StateId,
                        (combined, state) => new { Student = combined.Student, City = combined.City, State = state }
                    )
                    .Select(result => new StudentViewModel
                    {
                        StudentId = result.Student.StudentId,
                        FirstName = result.Student.FirstName,
                        LastName = result.Student.LastName,
                        Email = result.Student.Email,
                        StateName = result.State.StateName,
                        StateId = result.State.StateId,
                        CityName = result.City.CityName,
                        CityId = result.City.CityId,
                        HobbyName = string.Join(", ", _studnetDbontext.Hobbies.Where(h => result.Student.HobbiesIds.Contains(h.HobbyId.ToString())).Select(h => h.HobbyName)),
                        Gender = result.Student.Gender,
                        PhoneNumber = result.Student.PhoneNumber,
                        Address = result.Student.Address,
                        DateOfBirth = result.Student.DateOfBirth
                    })
                    .ToList();

                return Ok(students);
            }
            catch (Exception ex)
            {
                // Handle exception
                return StatusCode(500, "Internal server error");
            }
        }

        //STATES
        [HttpGet]
        [Route("GetStates")]
        public async Task<ActionResult<IEnumerable<State>>> GetStates()
        {
            try
            {
                var states = await _studnetDbontext.State.ToListAsync();
                if (states.Count == 0)
                {
                    return NotFound("States not available");
                }
                return Ok(states);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // CITIES 
        [HttpGet]
        [Route("GetCities/{StateId}")]
        public async Task<ActionResult<IEnumerable<City>>> GetCities(int StateId)
        {
            try
            {
                var cities = await _studnetDbontext.City.Where(c => c.StateId == StateId).Select(c => new { c.CityId, c.CityName }).ToListAsync();
                if (cities.Count == 0)
                {
                    return NotFound("Cities not available for selected state");
                }
                return Ok(cities);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //HOBBIES
        [HttpGet]
        [Route("GetHobbies")]
        public async Task<ActionResult<IEnumerable<Hobbies>>> GetHobbies()
        {
            try
            {
                var hobbies = await _studnetDbontext.Hobbies.Select(h => new { h.HobbyId, h.HobbyName }).ToListAsync();
                if (hobbies.Count == 0)
                {
                    return NotFound("hobbies not available for selected state");
                }
                return Ok(hobbies);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //PARTICULAR STUDENT DETAILS 
        [HttpGet]
        [Route("GetStudentDetails/{StudentId}")]
        public IActionResult GetStudentDetails(int StudentId)
        {
            try
            {
                var students = _studnetDbontext.Student.Find(StudentId);
                if (students == null)
                {
                    return NotFound($"Student not available with this id: {StudentId} ");
                }
                Student student = new Student()
                {
                    StudentId = students.StudentId,
                    FirstName = students.FirstName,
                    LastName = students.LastName,
                    Email = students.Email,
                    StateId = _studnetDbontext.City.FirstOrDefault(c => c.CityId == students.CityId)?.StateId ?? 0,
                    CityId = students.CityId,
                    Gender = students.Gender,
                    HobbiesIds = students.HobbiesIds,
                    PhoneNumber = students.PhoneNumber,
                    Address = students.Address,
                    DateOfBirth = students.DateOfBirth,
                    Hobbies = students.Hobbies
                };
                return Ok(student);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //POST METHOD FOR ADD OR UPDATE STUDENT
        [HttpPost]
        [Route("AddUpdateStudent")]
        public async Task<ActionResult> AddStudent(Student student)
        {
            try
            {
                student.DateOfBirth = DateTime.Parse(student.DateFormat);
                if (student.StudentId > 0)
                {
                    _studnetDbontext.Student.Update(student);
                }
                else
                {
                   await _studnetDbontext.Student.AddAsync(student);
                }
                await _studnetDbontext.SaveChangesAsync();
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //DELETE STUDENT DATA
        [HttpDelete]
        [Route("Delete/{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            try
            {
                var student = _studnetDbontext.Student.FirstOrDefault(s => s.StudentId == id);
                if (student == null)
                {
                    return NotFound();
                }
                _studnetDbontext.Student.Remove(student);
                await _studnetDbontext.SaveChangesAsync();
                return Ok(student);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
